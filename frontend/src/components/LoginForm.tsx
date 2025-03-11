import { useState } from 'react';
import { buildPath } from './BuildApiPath.js';

//images
import hide from '../assets/togglePassword/hide.png';
import show from '../assets/togglePassword/show.png';

interface LoginFormProps {
  setMessage: (message: string) => void; // Function that takes a string and returns nothing
}

export default function LoginForm({setMessage} : LoginFormProps){

   //using the useState hook so that react can keepp track of these variables as  their state changes eg user types.
  const [emailName, setEmail] = useState('');
  const [loginPassword, setPassword] = useState('');
  const [showPassword, setVisibility] = useState(false); //state so we can toggle password visbility. If show password is true we want to well show it. If its false then hide it

  //function gets called on submission of from async so we can use await
  async function doLogin(event: any): Promise<void> {
    event.preventDefault();

    const obj = { Login: emailName, Password: loginPassword }; //make an obj to send to api that stores the login credentials and password of user
    const js = JSON.stringify(obj); //stringify said object to send to api as pakcage

    console.log('Login:', emailName);
    console.log('Password:', loginPassword);

    try { //try api request

      const response = await fetch(buildPath('login'), { //send fetch request using buildPath function so that it makes the URL depending on if we are on local host or deployed version
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json(); //convert response to json and store it in a variable

      if (!res.id) {
        setMessage('User/Password combination incorrect'); //if password combo is incorrect meaning the id isnt a number greater than 0 display error message
      } else { //otherwise combo was correct

        const user = { //make an object from response
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
      
        localStorage.setItem('user_data', JSON.stringify(user)); //store objet in local storage so we can use later
        setMessage(''); //leave message empty
        window.location.href = '/dashboard'; //*****have this line as /dashboard so that it redirects us to log in test which is working fine****

      }

    } catch (error: any) {
          alert(error.toString());
    }

  }
  return(

    <form onSubmit = {doLogin}> {/*On form submit execute the login function*/}
      <div className ="flex flex-col justify-center items-center gap-6"> {/*Keep al form items in a flex col so that they are above one another */}

        <div className = "flex flex-col items-start gap-2"> {/*Wrap labels and inputs in another flex col so lable lines up left with input box */}
          <label htmlFor="email"> Email </label>
          {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
          <input onChange = {(e) => {setEmail(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4" type="email" required id="email" name="email" placeholder='Youraddress@example.com' />
        </div>

        <div className = "flex flex-col items-start gap-2 relative">
          <label htmlFor="password"> Password </label>
          {/*Make sure on input change we grab the event and call the callback funciton that sets the email state to whatever users key stroke was dyanmaic updating */}
          <input onChange = {(e) => {setPassword(e.target.value)}} className = "w-[500px] h-12 rounded-lg pl-4 " type= {showPassword? 'text': 'password'} required id="password" name="password" placeholder='Password'/>

          <button type = "button" className = {`absolute bottom-2 right-4 ${loginPassword ? '': 'opacity-50 cursor-not-allowed'}`} disabled={!loginPassword} onClick = {() => setVisibility((prev)=> !prev)}> {/*On click of this button we toggle the bool of our showPassword so that state changes and everything using show password re-renders. Also have disabled so that when password is not empty so !password it returns true which enables button to have onclick functionality */}
            <img src = {showPassword? hide: show} alt = "toggle password icon" className = "w-8 h-8 pointer-events-none" />
          </button>
        </div>

        <button className = "text-2xl text-white w-[500px] h-12 bg-themeGreen rounded-lg mt-10 hover:scale-105"type="submit">Submit</button>

      </div>
    </form>

  );
}