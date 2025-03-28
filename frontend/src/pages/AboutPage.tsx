import React from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import Logo from '../assets/GreenLogo.png';
import Tree from '../assets/tree.png';
import Kevin from '../assets/About-Images/kevinpfp.JPG'; 
import Daniel from '../assets/About-Images/Daniel.JPG'; 


export default function AboutPage(){

    const devs = [
        { 
            name: "Kevin Pereda",
            role: "Project Manager",
            pic: Kevin
        },
        { 
            // IMPORT PROFILE PHOTO
            name: "Daniel Pereda",
            role: "Database, API",
            pic: Daniel
        },
        { 
            // IMPORT PROFILE PHOTO
            name: "Jesiel Reyes",
            role: "Front End",
        },
        { 
            
            name: "Sadie Burns",
            role: "Front End, Mobile",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Ethan McKissic",
            role: "Front End",
        },
        { 
            name: "Ernesto Perez",
            role: "Front End, API",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Kenneth Arias",
            role: "API",
            // IMPORT PROFILE PHOTO
        }
    ];

    return (
        <div className = "min-h-screen flex flex-col justify-center items-center relative">
            <Link to="/" className="left-8 top-4 hover:scale-105 fixed">
                <img src={Logo} alt="DressMeUp Logo" className = "w-24 h-24 rounded-lg" />
            </Link>
            <h1 className='text-6xl absolute top-0'>Meet the developers</h1>
            <div className="flex flex-col justify-center items-center lg:h-[30rem] lg:w-[75rem] lg:relative lg:top-12 lg:right-4"> 
                <div className="flex lex-row justify-center gap-12 h-full flex-wrap">
                    {devs.slice(0, 3).map((dev, index) => (
                        <ProfileCard key={index} {...dev} />
                    ))}
                </div>
                <div className="flex flex-row justify-center gap-12 h-full w-full flex-wrap">
                {devs.slice(3, 7).map((dev, index) => (
                        <ProfileCard key={index} {...dev} />
                    ))}
                </div>
            </div>
            <img src={Tree} alt="Tree" className="collapse lg:visible fixed top-10 scale-[1.25] z-[-1] h-auto"/> 
        </div>
    ); 
}