import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import Logo from '../assets/GreenLogo.png';
import Tree from '../assets/tree.png';
import Kevin from '../assets/About-Images/kevinpfp.JPG'; 
import Daniel from '../assets/About-Images/Daniel.JPG'; 
import Ethan from '../assets/About-Images/ethan.jpg';
import Jesiel from '../assets/About-Images/Jesiel.JPG';
import Sadie from '../assets/About-Images/sadie.png';
import Ernesto from '../assets/About-Images/ErnestoPFP.jpg';
import Kenneth from '../assets/About-Images/kenneth.JPG';

export default function AboutPage(){
    const devs = [
        { 
            name: "Daniel Perera",
            role: "Database, Mobile",
            pic: Daniel          
        },
        { 
            name: "Kevin Pereda",
            role: "Front End",
            pic: Kevin
        },
        { 
            name: "Jesiel Reyes",
            role: "Front End",
            pic: Jesiel
        },
        { 
            name: "Ethan McKissic",
            role: "Front End",
            pic: Ethan
        },
        { 
            name: "Kenneth Arias",
            role: "API",
            pic: Kenneth,
            
        },
        { 
            name: "Sadie Burns",
            role: "API",
            pic: Sadie
        },
        { 
            name: "Ernesto Perez",
            role: "Front End, API",
            pic: Ernesto
        }
    ];
    // Removes default padding and width opon rendering
    useEffect(() => {
        document.getElementById("root")?.classList.add("dashboard");
      
        return () => {
            document.getElementById("root")?.classList.remove("dashboard");
        };
    }, []);
    

    return (
        <div className = "h-screen min-w-screen overflow-auto lg:overflow-hidden">
            <Link to="/" className="hover:scale-105 absolute z-[2] top-7 left-4 sm:left-8 ">
                <img src={Logo} alt="DressMeUp Logo" className = "w-12 h-12 sm:w-20 sm:h-20 rounded-lg shadow-xl object-cover" />
            </Link>
            <header className="flex flex-row items-center justify-center min-w-screen relative top-8 mb-24 lg:mb-0">
                <h1 className='text-4xl md:text-6xl'>Meet the developers</h1>
            </header>
            <main className="min-w-screen min-h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center sm:m-0 w-[20rem] lg:h-[30rem] lg:w-[75rem] lg:relative lg:bottom-2 lg:right-4"> 
                    <div className="flex flex-row justify-center gap-12 h-full flex-wrap">
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
            </main>
        </div>
    ); 
}