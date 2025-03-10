import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/GreenLogo.png';
import Tree from '../assets/tree.png';

export default function AboutUs(){

    return (
        <div className = "min-h-screen flex flex-col justify-center items-center relative">
            <Link to="/" className="-left-72 top-0 hover:scale-105 absolute">
                <img src={Logo} alt="DressMeUp Logo" className = "w-24 h-24 rounded-lg" />
            </Link>
            <h1 className='text-6xl absolute top-0'>Meet the developers!</h1>
            <div className=" h-[35rem] w-[60rem]"> {/* FOR MOCKUP: border-2 border-solid rounded-sm */}

            </div>
            <img src={Tree} alt="Tree" className="fixed top-10 scale-[1.25] z-[-1]  h-auto"/> 
        </div>
    ); 
}