// api.js
const User = require('./models/user');
const Card = require('./models/card');
const Weather = require('./models/weather');
const token = require('./createJWT'); // Assuming you have your JWT helper in createJWT.js

const axios = require('axios');
const express = require('express');
const jsonWebToken = require('jsonwebtoken');
const sendEmailVerification = require('./sendEmailVerification');

module.exports = function (app) {

app.post('/api/register', async (req, res) => {
  const { FirstName, LastName, Login, Password, Country, City } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ Login: Login.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this login already exists' });
    }

    // 2. Create a new user
    const newUser = new User({
      UserId: Date.now(), // or another unique ID approach
      FirstName: FirstName.trim(),
      LastName: LastName.trim(),
      Login: Login.trim(),
      Password: Password.trim(), // In production, hash this!
      Country: Country.trim(),
      City: City.trim(),
      verified: false,
    });

    await newUser.save();

    // create custom json web token
    const token = jsonWebToken.sign({ id: newUser.UserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // the verification link
    // Going to use process.env.ENV_NODE variable to check if we are on production or local host
    let verificationLink;

    if (process.env.NODE_ENV === 'production') { //if we are on production make verification link hit the api endpoint on the actual domain name
      verificationLink = `http://dressmeupproject.com/auth/verify-email?token=${token}`;
    } else { //otherwise jsut do local host
      verificationLink = `http://localhost:5001/auth/verify-email?token=${token}`;
    }


    // wait for the email to send
    await sendEmailVerification(newUser.Login.trim(), verificationLink);

    // 3. (Optional) Auto-login the user by returning a JWT
    // const jwtToken = token.createToken(newUser.FirstName, newUser.LastName, newUser.UserId);

    // 4. Return success
    res.status(200).json({
      error: '',
      // jwtToken, // if you're returning a token
      firstName: newUser.FirstName,
      lastName: newUser.LastName,
      userId: newUser.UserId,
      Country: newUser.Country,
      City: newUser.City,
      message: 'You have successfully registered! Please check email to verify account and finish registration.'
    });
  } catch (e) {
    console.error('Error in /api/register:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/auth/verify-email', async (req, res) => {

  console.log("Hitting verify-email");

  // get token
  const { token } = req.query;

  // wrap in try/catch for any erros
  try {
    // decode the json web token
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);

    // find the user associated w/ token
    const user = await User.findOne({ UserId: decoded.id }); //had to change this to find one becasuse findById trys to find by users default _id field that mongo assigns and decoded.id is our customer Userid field

    // if user does't exist, error
    if (!user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // if user does, assign true to verified
    user.verified = true;
    await user.save();
    
    res.status(200).json({ message: 'You have been successfully verified!' });

    // else, error
    } catch (error) { 
        console.error('Error during email verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  app.post('/api/addcard', async (req, res, next) => {
    const { userId, card, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        res.status(401).json({ error: 'The JWT is no longer valid', jwtToken: '' });
        return;
      }

      const newCard = new Card({ Card: card, UserId: userId });
      await newCard.save();

      const refreshedToken = token.refresh(jwtToken);
      res.status(200).json({ error: '', jwtToken: refreshedToken });
    } catch (e) {
      res.status(500).json({ error: e.message, jwtToken: '' });
    }
  });

  app.post('/api/searchcards', async (req, res, next) => {
    const { userId, search, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        res.status(401).json({ error: 'The JWT is no longer valid', jwtToken: '' });
        return;
      }

      const _search = search.trim();
      const results = await Card.find({
        UserId: userId,
        Card: { $regex: _search + '.*', $options: 'i' }
      });

      const _ret = results.map(result => result.Card);
      const refreshedToken = token.refresh(jwtToken);

      res.status(200).json({ results: _ret, error: '', jwtToken: refreshedToken });
    } catch (e) {
      res.status(500).json({ error: e.message, jwtToken: '' });
    }
  });

  app.post('/api/login', async (req, res) => {
    console.log("Received login request:", JSON.stringify(req.body, null, 2));

    const { Login, Password } = req.body;

    try {
      const user = await User.findOne({ //changed this from find to findOne so we target one user at a time there wont be dups anyways we check this in register
        Login: Login.trim(),
        Password: Password.trim()
      });

      console.log("Database query result:", JSON.stringify(user, null, 2));

      if(!user){ //if there is no user object then its cause we didnt find correct login and password on the database
        return res.status(401).json({error: "Incorrect email and password!"}); //return 401 error status with appropriate error message
      }
      if(!user.verified){  //if we are here it means user exists so check if they are verified if they arent then
        return res.status(403).json({error: "Please verify your email before signing in!", verified: false}); //exit with an erro code as well
      }
      
      //if we didnt exit in above checks then it means the user is verified and logged in so return success code along with all user information
      return res.status(200).json({
        id: user.UserId,
        firstName: user.FirstName,
        lastName: user.LastName,
        country: user.Country,
        city: user.City,
        verified: true,
        error: ''
      });

    } catch (e) {
      console.error("Error in /api/login:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/weather', async (req, res) => {
    try {
      const { city, country } = req.query;
      const API_KEY = '2e18e1b041698949b18ec7270162d99a';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`;

      const response = await axios.get(url);
      const { name, sys, main, weather } = response.data;

      const weatherData = new Weather({
       city: city,
       country: sys.country,
       temperature: main.temp,
       description: weather[0].description,
       icon: `https://openweathermap.org/img/wn/${weather[0].icon}.png`
      });

      res.json(weatherData);
    } catch (error) {
      console.error('Error in /api/weather: ', error);
      res.status(500).json({ error: error.message });
    }
  })

};
