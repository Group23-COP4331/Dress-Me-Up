import { Link } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import Logo from '../assets/GreenLogo.png';
import Tree from '../assets/tree.png';

export default function AboutPage() {
    const devs = [
        { 
            name: "Kevin Pereda",
            role: "Project Manager",
            // photo: 'path-to-kevin-photo.jpg'
        },
        { 
            name: "Jesiel Reyes",
            role: "Front End",
            // photo: 'path-to-jesiel-photo.jpg'
        },
        { 
            name: "Ethan McKissic",
            role: "Front End",
            // photo: 'path-to-ethan-photo.jpg'
        },
        { 
            name: "Sade",
            role: "Front End, Mobile",
            // photo: 'path-to-sade-photo.jpg'
        },
        { 
            name: "Ernesto Perez",
            role: "Front End, API",
            // photo: 'path-to-ernesto-photo.jpg'
        },
        { 
            name: "Daniel",
            role: "Database, API",
            // photo: 'path-to-daniel-photo.jpg'
        },
        { 
            name: "Kenneth Arias",
            role: "API",
            // photo: 'path-to-kenneth-photo.jpg'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative">
            <Link to="/" className="-left-72 top-0 hover:scale-105 absolute">
                <img src={Logo} alt="DressMeUp Logo" className="w-24 h-24 rounded-lg" />
            </Link>
            <h1 className='text-6xl absolute top-0'>Meet the developers</h1>
            <div className="flex flex-col justify-center items-center h-[30rem] w-[75rem]"> 
                <div className="flex flex-row justify-center gap-12 h-full">
                    {devs.slice(0, 3).map((dev, index) => (
                        <ProfileCard 
                            key={index}
                            name={dev.name}
                            role={dev.role}
                            // photo={dev.photo}
                        />
                    ))}
                </div>
                <div className="flex flex-row justify-center gap-12 h-full w-full mt-8">
                    {devs.slice(3).map((dev, index) => (
                        <ProfileCard 
                            key={index + 3}  // Offset index for unique keys
                            name={dev.name}
                            role={dev.role}
                            // photo={dev.photo}
                        />
                    ))}
                </div>
            </div>
            <img src={Tree} alt="Tree" className="fixed top-10 scale-[1.25] z-[-1] h-auto"/> 
        </div>
    );
}