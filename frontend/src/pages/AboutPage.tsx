
import { Link } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import Logo from '../assets/GreenLogo.png';
import Tree from '../assets/tree.png';

export default function AboutPage(){

    const devs = [
        { 
            name: "Kevin Pereda",
            role: "Project Manager",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Jesiel Reyes",
            role: "Front End",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Ethan McKissic",
            role: "Front End",
            // IMPORT PROFILE PHOTO
        },
        { 
            
            name: "Sade",
            role: "Front End, Mobile",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Ernesto Perez",
            role: "Front End, API",
            // IMPORT PROFILE PHOTO
        },
        { 
            name: "Daniel",
            role: "Database, API",
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
            <Link to="/" className="-left-72 top-0 hover:scale-105 absolute">
                <img src={Logo} alt="DressMeUp Logo" className = "w-24 h-24 rounded-lg" />
            </Link>
            <h1 className='text-6xl absolute top-0'>Meet the developers</h1>
            <div className="flex flex-col justify-center items-center h-[30rem] w-[75rem]"> 
                <div className="flex flex-row justify-center gap-12 h-full ">
                    <ProfileCard />
                    <ProfileCard />
                    <ProfileCard />
                </div>
                <div className="flex flex-row justify-center gap-12 h-full w-full">
                    <ProfileCard />
                    <ProfileCard />
                    <ProfileCard />
                    <ProfileCard />
                </div>
            </div>
            <img src={Tree} alt="Tree" className="fixed top-10 scale-[1.25] z-[-1]  h-auto"/> 
        </div>
    ); 
}