import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/GreenLogo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-themeGray shadow-md">
      <div className="flex items-center justify-between px-6 h-16">
        <Link to="/dashboard">
          <img src={Logo} alt="Logo" className="h-9 w-9 mr-2 rounded-md" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/mycloset" className="text-lg font-semibold text-white hover:text-blue-500">
            My Closet
          </Link>
          <Link to="/ootd" className="text-lg font-semibold text-white hover:text-blue-500">
            Outfit of the Day
          </Link>
        </div>
        
        <div className="hidden md:flex items-center">
          <button className="text-lg font-semibold text-white hover:text-blue-500">
            Logout
          </button>
        </div>

        {/* Menu button*/}
        <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>


      {/* Fullscreen Hamburger Menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50 transition-opacity duration-700"
          onClick={() => setIsOpen(false)} // Close on click
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsOpen(false)}>
            <X size={30} />
          </button>
          <Link to="/mycloset" className="text-2xl font-semibold py-4" onClick={() => setIsOpen(false)}>
            My Closet
          </Link>
          <Link to="/ootd" className="text-2xl font-semibold py-4" onClick={() => setIsOpen(false)}>
            Outfit of the Day
          </Link>
          <button className="text-2xl font-semibold py-4" onClick={() => setIsOpen(false)}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
