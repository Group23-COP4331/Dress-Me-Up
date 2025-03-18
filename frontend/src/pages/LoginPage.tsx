//import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/LoginBox';
import Logo from '../assets/GreenLogo.png';

export default function LoginPage(){
  return (
    <div className = "min-h-screen flex flex-row justify-center items-center relative">
      
      <Link to="/" className="-left-72 top-0 hover:scale-105 absolute"> {/*Using link here instead of a button cause we dont need any crazy functionaliity logo on top left of login screen will literally jusst take user back to landing page */}
        <img src={Logo} alt="DressMeUp Logo" className = "w-44 h-44 rounded-lg" />
      </Link>

      <Login /> {/*Call login component which is login box with login and register form that changes depending on button user clicks */}
    </div>
  );
};

