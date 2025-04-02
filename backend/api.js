const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('./models/user');
const Card = require('./models/card');
const Weather = require('./models/weather');
const token = require('./createJWT');
const ClothingItem = require('./models/clothingItem');
const Outfit = require('./models/outfit');
const OutfitPlan = require('./models/outfitPlan');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const axios = require('axios');
const express = require('express');
const jsonWebToken = require('jsonwebtoken');
const sendEmailVerification = require('./sendEmailVerification');
const compression = require('compression');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function (app) {

const cors = require('cors');
app.use(cors({ 
  origin: ['https://dressmeupproject.com', 'http://localhost:5173'],
 }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


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
    const verifyToken = jsonWebToken.sign({ id: newUser.UserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // the verification link
    // Going to use process.env.ENV_NODE variable to check if we are on production or local host
    let verificationLink;

    if (process.env.NODE_ENV === 'production') { //if we are on production make verification link hit the api endpoint on the actual domain name
      verificationLink = `http://dressmeupproject.com/verify-email?token=${verifyToken}`;
    } else { //otherwise jsut do local host
      verificationLink = `http://localhost:5173/verify-email?token=${verifyToken}`;
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

app.post("/api/requestResetPassword", async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ Login: login });
    if (!user)
      return res.status(404).json({ message: "User does not exist" });

    const resetToken = jsonWebToken.sign({ id: user.UserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    let requestLink;

    if (process.env.NODE_ENV === 'production') {
      requestLink = `http://dressmeupproject.com/api/reset-password?token=${resetToken}`;
    } else {
      requestLink = `http://localhost:5001/api/reset-password?token=${resetToken}`;
    }

    const msg = {
      to: login,
      from: 'dressmeupprojectemail@gmail.com',
      subject: "Password Reset for DressMeUp",
      html: `<p>Click the following link to reset your password for DressMeUp!</p>
        <a href="${requestLink}">Reset Password</a>`
    };

    await sgMail.send(msg);
    return res.status(200).json({ message: "Reset password link sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error in requestResetPassword API", error });
  }
});

app.post("/api/resetPassword", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decodedToken = jsonWebToken.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ UserId: decodedToken.id });
    if (!user)
      return res.status(404).json({ message: "User does not exist" });

    user.Password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password has been reset!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error in resetPassword API", error });
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




  //Need to add jwtToken to this
  app.post('/api/addClothingItem', upload.single('image'), async (req, res, next) => {
    console.log('Files received:', req.file);
    console.log('--- Incoming addClothingItem Request ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    const { userId, name, color, category, size, jwtToken } = req.body;
    try {
      if (!name || !color || !category || !size) {
        return res.status(400).json({ error: 'Complete all fields', jwtToken: '' });
      }
    
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required', jwtToken: '' });
      }
    
      if (
        req.file.mimetype != 'image/jpeg' &&
        req.file.mimetype != 'image/png' &&
        req.file.mimetype != 'image/heic' &&
        req.file.mimetype != 'image/heif' &&
        req.file.mimetype != 'image/jpg' &&
        req.file.mimetype != 'image/webp'
      ) {
        return res.status(400).json({ error: 'Invalid image format', jwtToken: '' });
      }
    
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image exceeds 10MB', jwtToken: '' });
      }
    
      const newItem = new ClothingItem({
        UserId: userId,
        Name: name,
        Color: color,
        Category: category,
        Size: size,
        file: req.file.buffer,
        fileType: req.file.mimetype,
      });
    
      await newItem.save();
    
      // Convert the Mongoose document to a plain object
      let newItemObj = newItem.toObject();
      // Convert the file Buffer to a base64 string
      newItemObj.file = newItemObj.file.toString('base64');
    
      const refreshedToken = jwtToken; // Adjust if you need to refresh the token
    
      res.status(201).json({
        error: '',
        jwtToken: refreshedToken,
        newItem: newItemObj
      });
    } catch (e) {
      res.status(500).json({ error: e.message, jwtToken: '' });
    }
  });


  //Need to add jwtToken to this
  // GET route: /api/getClothingItems?userId=...&page=1&limit=12
  app.get('/api/getClothingItems', async (req, res) => {
    console.log("🛠️ Received getClothingItems request");

    const { userId, page = 1, limit = 12, category, search } = req.query;
    console.log("🔍 Incoming query params:", req.query);

    const skip = (page - 1) * limit;

    try {
      const query = { UserId: userId.toString() };

      if (category) {
        const categories = Array.isArray(category)
          ? category
          : category.split(',');

        query.Category = {
          $in: categories.map(c => new RegExp(`^${c}$`, 'i')) // case-insensitive match
        };
      }

      if (search) {
        query.Name = { $regex: search, $options: 'i' };
      }

      // ✅ Add this block:
      if (req.query.favorite === 'true') {
        query.isFavorite = true;
      }

      console.log("🧩 MongoDB query:", query);

      const items = await ClothingItem.find(query)
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      console.log("📦 Items fetched from DB:", items.length);

      const result = items.map(item => {
        const itemObj = item.toObject();
        if (itemObj.file && itemObj.file.data) {
          itemObj.file = Buffer.from(itemObj.file.data).toString('base64');
        } else if (Buffer.isBuffer(itemObj.file)) {
          itemObj.file = itemObj.file.toString('base64');
        }
        return itemObj;
      });

      res.json({ results: result });
    } catch (err) {
      console.error("❌ Error in getClothingItems:", err);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  });

  



  app.post('/api/toggleFavorite', async (req, res) => {
    const { _id } = req.body;
  
    try {
      const item = await ClothingItem.findById(_id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      item.isFavorite = !item.isFavorite;
      await item.save();
  
      res.status(200).json({ message: 'Favorite updated', isFavorite: item.isFavorite });
    } catch (err) {
      res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  });
  
  //need to add jwtToken to this
  app.post('/api/updateClothingItem', upload.single('image'), async (req, res, next) => {
    const {_id, name, color, category, size, jwtToken} = req.body;
    try{
      item = await ClothingItem.findById(_id)
      if (!item) {
        return res.status(404).json({error: 'Item not found'});
      }
      if (name) {
        item.Name = name;
      }
      if (color) {
        item.Color = color;
      }
      if (category) {
        item.Category = category;
      }
      if (size) {
        item.Size = size;
      }
      if (req.file) {
        if(req.file.mimetype != 'image/jpeg' && req.file.mimetype != 'image/png' && 
        req.file.mimetype != 'image/heic' && req.file.mimetype != 'image/heif' && 
        req.file.mimetype != 'image/jpg' && req.file.mimetype != 'image/webp') 
        {
          return res.status(400).json({error: 'Invalid image format', jwtToken: ''});
        }
        if(req.file.size > 10 * 1024 * 1024)
        {
          return res.status(400).json({error: 'Image exceeds 10MB', jwtToken: ''});
        }
        item.file = req.file.buffer;
        item.fileType = req.file.mimetype;
      }
      await item.save();
      const updatedItem = item.toObject();
if (updatedItem.file && Buffer.isBuffer(updatedItem.file)) {
  updatedItem.file = updatedItem.file.toString('base64');
}
console.log('Sending item:', typeof updatedItem.file); // Should log "string"

res.status(200).json({ item: updatedItem, message: 'Item Updated', error: '' });
    } catch(e) {
      res.status(500).json({error: e.message});
    }
  })

  //need to add jwtToken to this
  app.post('/api/deleteClothingItem', async (req, res, next) =>{
    const {_id, jwtToken} = req.body; 
    id = _id;
    try {
      const deleted = await ClothingItem.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({error: 'Item id not found'});
      }
      res.status(200).json({id, message: 'Item Deleted', error: ''});
      }
    catch(e) {
      res.status(500).json({error: e.message});
    }
  })

  app.post('/api/outfitPlan', async (req, res, next) => {
    const {userId, name, date, outfitId} = req.body;
    try{
      const newPlan = new OutfitPlan({
        UserId: userId,
        Name: name,
        Date: new Date(date), // YYYY-MM-DD
        OutfitId: outfitId
      })
      await newPlan.save();
      res.status(200).json({message: 'Outfit Planned', error: ''});
    } catch (error) {
      console.log(OutfitPlan);
      res.status(500).json({error: 'Error in outfitPlan api',
      details: error.message
    });
    }
  })
  ///query: /api/getPlans?userId=...
  app.get('/api/getPlans', async (req, res, next) => {
    const {userId} = req.query;
    try{
      const plans = await OutfitPlan.find({UserId: userId});
      res.status(200).json(plans);
    }catch (e) {
      res.status(500).json({error: e.message});
    }
  })

  app.post('/api/updatePlan', async (req, res, next) => {
    const {userId, planId, name, outfitId} = req.body;
    try{
      const updatePlan = await OutfitPlan.findById(planId);
      if (!updatePlan) {
        return res.status(404).json({error: 'Plan not found'});
      }
      if (name) {
        updatePlan.Name = name;
      }
      if (outfitId) {
        updatePlan.OutfitId = outfitId;
      }
      await updatePlan.save();
      res.status(200).json({updatePlan});
    }
    catch (e){
      console.log('Error in updatePlan:', e);
      res.status(500).json({error: e.message});
    }
  })

  app.post('/api/deletePlan', async (req, res, next) => {
    const{userId, planId} = req.body;
    try{
      const deleted = await OutfitPlan.findByIdAndDelete(planId);
      if (!deleted) {
        return res.status(400).json({error: 'Plan not found'});
      }
      res.status(200).json({message: 'Plan deleted', error: ''});
    }
    catch (e){
      console.log('Error in deletePlan:', e);
      res.status(500).json({error: e.message});
    }
  })

  app.post('/api/randomOutfit', async (req, res, next) => {
    const {userId} = req.body;

    try{
      const tops = await ClothingItem.find({UserId: userId, 
        Category: {$in: ['Shirts', 'Longsleeves']}});
      console.log('tops:', tops.length);
      const bottoms = await ClothingItem.find({UserId: userId, 
        Category: {$in: ['Pants', 'Shorts']}});
      console.log('bottoms:', bottoms.length);
      const shoes = await ClothingItem.find({UserId: userId.toString(), Category: 'Shoes'});
      console.log('shoes:', shoes.length);
      if(tops.length === 0 || bottoms.length === 0 || shoes.length === 0){
        return res.status(500).json({error: 'Not Enough Clothing Items to Create Outfit'});
      }
      const randomTop = tops[Math.floor(Math.random() * tops.length)]._id;
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)]._id;
      const randomShoes = shoes[Math.floor(Math.random() * shoes.length)]._id;
      const randomOutfit = new Outfit({
        UserId: userId,
        Name: 'Random Outfit',
        Top: randomTop,
        Bottom: randomBottom,
        Shoes: randomShoes,
        WeatherCategory: 'Normal'
      })
      await randomOutfit.save();
      res.status(200).json( {outfit: randomOutfit, error: ''});
    }
    catch (e) {
      console.log('Error in randomOutfit:', e);
      res.status(500).json({error: e.message});
    }});

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
      const user = await User.findOne({
        Login: Login.trim(),
        Password: Password.trim()
      });
  
      console.log("Database query result:", JSON.stringify(user, null, 2));
  
      if(!user){
        return res.status(401).json({ error: "Insrect email and password!" });
      }
      if(!user.verified){
        return res.status(403).json({ error: "Please verify your email before signing in!", verified: false });
      }
  
      // >>> Create the JWT token here <<<
      const jwtToken = token.createToken(user.FirstName, user.LastName, user.UserId);
  
      console.log("Login route token:", jwtToken)
      // Return user info + the token
      return res.status(200).json({
        id: user.UserId,
        firstName: user.FirstName,
        lastName: user.LastName,
        country: user.Country,
        city: user.City,
        verified: true,
        error: '',
        // The 'accessToken' property depends on your createJWT.js structure
        jwtToken: jwtToken
      });
  
    } catch (e) {
      console.error("Error in /api/login:", e);
      res.status(500).json({ error: e.message });
    }
  });
  

  app.post('/api/addOutfit', async (req, res) => {
    try {
      const { userId, name, top, bottom, shoes, weatherCategory } = req.body;

      if (!userId || !name || !top || !bottom || !shoes) {
        return res.status(400).json({ error: 'Fields are wrong!' });
      }

      const newOutfit = new Outfit({
        UserId: userId,
        Name: name,
        Top: new ObjectId(top),
        Bottom: new ObjectId(bottom),
        Shoes: new ObjectId(shoes),
        WeatherCategory: weatherCategory,
      });

      await newOutfit.save();
      res.status(200).json(newOutfit);
    } catch (error) {
      res.status(500).json({ error: 'Error in addOutfit api', details: error.message });
    }
  });

  app.post('/api/deleteOutfit', async (req, res) => {
    const { _id } = req.body; // ✅ Destructure _id properly
  
    try {
      const deleted = await Outfit.findByIdAndDelete(_id);
  
      if (!deleted) {
        return res.status(404).json({ error: 'Outfit id not found' });
      }
  
      res.status(200).json({ _id, message: 'Outfit Deleted', error: '' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  

  app.get('/api/getOutfits', async (req, res) => {
    const { userId } = req.query;
    try {
      const outfits = await Outfit.find({ UserId: userId })
        .populate('Top')
        .populate('Bottom')
        .populate('Shoes')
        .lean(); // Convert to plain objects

      const toBase64 = (file) => {
        if (!file) return null;
        if (file.data) return Buffer.from(file.data).toString('base64');
        if (Buffer.isBuffer(file)) return file.toString('base64');
        return file;
      };

      const results = outfits.map((outfit) => {
        if (outfit.Top?.file) {
          outfit.Top.file = toBase64(outfit.Top.file);
        }
        if (outfit.Bottom?.file) {
          outfit.Bottom.file = toBase64(outfit.Bottom.file);
        }
        if (outfit.Shoes?.file) {
          outfit.Shoes.file = toBase64(outfit.Shoes.file);
        }
        return outfit;
      });

      console.log("✅ Final outfit payload:", JSON.stringify(results[0], null, 2));

      res.json({ results });
    } catch (err) {
      console.error("Error in getOutfits:", err);
      res.status(500).json({ error: 'Failed to fetch outfits' });
    }
  });

  app.post('/api/updateOutfit', async (req, res) => {
    const { _id, name, top, bottom, shoes, weatherCategory } = req.body;
    try {
      const outfit = await Outfit.findById(_id);
      if (!outfit) {
        return res.status(404).json({ error: 'Outfit not found' });
      }
      if (name) outfit.Name = name;
      if (top) outfit.Top = mongoose.Types.ObjectId(top);
      if (bottom) outfit.Bottom = mongoose.Types.ObjectId(bottom);
      if (shoes) outfit.Shoes = mongoose.Types.ObjectId(shoes);
      if (weatherCategory !== undefined) outfit.WeatherCategory = weatherCategory;

      await outfit.save();
      res.status(200).json({ updatedOutfit: outfit });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.get('/api/weather', async (req, res) => {
    try {
      const { city, country } = req.query;
      const API_KEY = process.env.WEATHER_API_KEY;
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
  });

    
  app.post('/api/logout', (req, res) => {
    res.clearCookie('jwtToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged out successfully' });
  });


};
