import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/GreenLogo.png';

export default function AboutUs(){

    return (
        <div className = "min-h-screen flex justify-center items-center relative">
            <Link to="/" className="-left-72 top-0 hover:scale-105 absolute">
                <img src={Logo} alt="DressMeUp Logo" className = "w-40 h-40 rounded-lg" />
            </Link>
            <h1>Meet the developers!</h1>
        </div>
    );
}