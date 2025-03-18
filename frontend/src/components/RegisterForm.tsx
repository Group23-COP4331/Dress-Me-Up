import React, { useState } from 'react';
import { buildPath } from './BuildApiPath'; // Your function to build API URLs
// import { storeToken } from '../tokenStorage'; // If you want to store JWT on registration

//images
import hide from '../assets/togglePassword/hide.png';
import show from '../assets/togglePassword/show.png';

interface RegisterFormComponent{ //Interface that will define our registerformcomponents being passed in so if the right stuff isnt passed ts yells at us
  setMessage: (message: string) => void;
}

export default function RegisterForm({setMessage} : RegisterFormComponent){

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setVisibility] = useState(false); //state so we can toggle password visbility. If show password is true we want to well show it. If its false then hide it


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const body = {
        FirstName: firstName,
        LastName: lastName,
        Login: email,
        Password: password
      };

      console.log(body); //just to check if values were set properly

      const response = await fetch(buildPath('register'), { //call buildPath to make the api route dynamic it will make a string depending on if we are on local host or server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body) //stringify to JSON what we are sending to server to be registered
      });

      const res = await response.json(); //wait for the response
      if (!response.ok) { //if we didnt get succesful code then registration failed
        // e.g. 400 or 500
        setMessage(res.error || 'Registration failed');
      } else { //otherwise it worked
        // If you want to auto-login the user, you'd store the JWT here:
        // storeToken(res.jwtToken);

        // Display success or navigate to a different page
        setMessage(res.message ||'Registration successful!');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while registering');
    }
  };

  return (
    <form onSubmit={handleSubmit}> {/*On form submission handleSubmit gets called which sends api request to register a user */}
      <div className ="flex flex-col justify-center items-center gap-6"> {/*Keep al form items in a flex col so that they are above one another */}

      <div className = "flex flex-col items-start gap-2"> {/*Wrap labels and inputs in another flex col so lable lines up left with input box */}
        <label htmlFor="firstname"> First Name</label>
        {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
        <input onChange = {(e) => {setFirstName(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4" type="text" required id="firstname" name="firstname" placeholder='First Name' />
      </div>

      <div className = "flex flex-col items-start gap-2">
        <label htmlFor="lastname"> Last Name </label>
        {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
        <input onChange = {(e) => {setLastName(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4" type="text" required id="lastname" name="lastname" placeholder='Last Name'/>
      </div>

      <div className = "flex flex-col items-start gap-2">
        <label htmlFor="email"> Email </label>
        {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
        <input onChange = {(e) => {setEmail(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4" type="email" required id="email" name="email" placeholder='Youraddress@example.com'/>
      </div>
      
      <div className = "flex flex-col items-start gap-2 relative">
        <label htmlFor="password"> Password </label>
        {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
        <input onChange = {(e) => {setPassword(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4" required pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
  title="Password must be at least 8 characters long, contain one letter, one number, and one symbol." type = {showPassword? 'text': 'password'} id="password" name="password" placeholder='Password'/>

        <button type = "button" className = {`absolute bottom-2 right-4 ${password ? '': 'opacity-50 cursor-not-allowed'}`} disabled={!password} onClick = {() => setVisibility((prev)=> !prev)}> {/*On click of this button we toggle the bool of our showPassword so that state changes and everything using show password re-renders. Also have disabled so that when password is not empty so !password it returns true which enables button to have onclick functionality */}
          <img src = {showPassword? hide: show} alt = "toggle password icon" className = "w-8 h-8 pointer-events-none" />
        </button>
      </div>

      <button className = "text-2xl text-white w-[500px] h-12 bg-themeGreen rounded-lg hover:scale-105"type="submit">Submit</button>

      </div>
    </form>
  );
};
