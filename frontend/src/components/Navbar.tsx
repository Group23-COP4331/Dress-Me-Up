import { useState } from "react";
import { Menu, X } from "lucide-react";
//import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/GreenLogo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  //const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies (if any) are sent
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Clear local storage or authentication state if needed
        localStorage.removeItem("token"); 
        window.location.href = '/'; 
      } else {
        console.error("Logout failed");
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error("Error during logout:", error);
      window.location.href = '/'; // Redirect user to login pages
    }
  };


  return (
    <nav className="bg-themeGray shadow-md">
      <div className="flex items-center justify-between px-6 h-16">
        <Link to="/dashboard" className="hover:brightness-75 ease-in duration-100">
          <img src={Logo} alt="Logo" className="h-9 w-9 mr-2 rounded-md" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/mycloset" className="text-lg font-semibold text-white hover:text-blue-500 ease-in duration-100">
            My Closet
          </Link>
          <Link to="/mycalendar" className="text-lg font-semibold text-white hover:text-blue-500 ease-in duration-100">
            Outfit of the Day
          </Link>
        </div>
        
        <div className="hidden md:flex items-center">
          <button className="text-lg font-semibold text-white hover:text-blue-500 ease-in duration-200" onClick={handleLogout}>
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
          <button className="absolute top-6 right-6 text-white hover:brightness-75 ease-in duration-100" onClick={() => setIsOpen(false)}>
            <X size={30} />
          </button>
          <Link to="/mycloset" className="text-2xl font-semibold py-4 hover:brightness-75 ease-in duration-100" onClick={() => setIsOpen(false)}>
            My Closet
          </Link>
          <Link to="/mycalendar" className="text-2xl font-semibold py-4 hover:brightness-75 ease-in duration-100" onClick={() => setIsOpen(false)}>
            Outfit of the Day
          </Link>
          <button className="text-2xl font-semibold py-4 hover:brightness-75 ease-in duration-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
