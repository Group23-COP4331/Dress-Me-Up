{/*
    themeGreen: '#B6C7AA',
    themeGray: '#A0937D',
    themeDarkBeige: '#E7D4B5',
    themeLightBeige: '#F6E6CB'

    use map for grid
*/}

import logo from "../assets/GreenLogo.png";
import redheart from "../assets/MyClosetImages/redheart.png";

export default function MyCloset()
{

    return (
        <div className="relative flex h-screen bg-themeLightBeige p-2">

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 flex flex-col items-center p-4 bg-themeLightBeige">
                <img src={logo} alt="DressMeUp Logo" className="w-32 h-32 rounded-lg mb-4" />
                
                {/* Menu Buttons */}
                <div className="flex flex-col w-5/6 h-auto gap-4 justify-center items-center bg-themeGray rounded-lg py-2">
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Saved Fits</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Shirts</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Long Sleeves</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Pants</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Shorts</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">Shoes</button>
                    <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg flex items-center justify-center gap-2">
                        Favorites <img src={redheart} alt="heart" className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center">
                {/* Search Bar */}
                <div className="fixed flex flex-col w-full max-w-2xl mt-2">
                    <input
                        type="text"
                        placeholder="Search ..."
                        className="px-4 py-2 w-full bg-themeGray focus:outline-none text-black placeholder-black rounded-full"
                    />
                </div>
            </div>

            {/* Right Sidebar Buttons */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg">Add Item</button>
                <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg">Create Outfit</button>
            </div>
        </div>
    );
}