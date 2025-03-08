import {useState} from 'react';
import logo from "../assets/GreenLogo.png";
import redheart from "../assets/MyClosetImages/redheart.png";

export default function MyCloset()
{
    const [isOpen, setIsOpen] = useState(false);

    return (

        <div className = "relative flex justify-start items-start h-screen pt-24 gap-20 -translate-x-36">

            <div className = "relative flex flex-col items-center justify-center bg-themeGray w-1/6 h-5/6 rounded-lg flex-shrink-0 gap-4 p-4">
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg flex items-center justify-center">Saved Fits</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg">Shirts</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg">Long Sleeves</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg">Pants</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg">Shorts</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg">Shoes</button>
                <button className = "text-white text-xl bg-themeGreen w-44 h-12 rounded-lg flex items-center justify-center gap-1 whitespace-nowrap">
                  Favorites <img src = {redheart} alt = "heart symbol" className = "w-8 h-8"></img>
                </button>

            </div>

            <div className="flex flex-col flex-shrink-0"> {/*Div for dressmeup logo ***FLEX COL CAUSE TEXT WILL GO UNDER IT IN THIS DIV */}
                <img src = {logo} alt = "DressMeUp Logo" className = "w-44 h-44 rounded-lg" />
            </div>

            <div className="flex items-center rounded-lg w-full max-w-lg">
                <input
                    type = "text"
                    placeholder = "Search ..."
                    className = "px-4 py-2 w-full bg-themeGray focus:outline-none text-black placeholder-black rounded-full">
                </input>
            </div>

            <div className = "relative flex flex-col items-center justify-center gap-6">
                <button className = "text-black text-2xl bg-themeGreen w-44 h-16 rounded-lg">Add Item</button>
                <button className = "text-black text-2xl bg-themeGreen w-44 h-16 rounded-lg">Create Outfit</button>
            </div>

        </div>
    );
}