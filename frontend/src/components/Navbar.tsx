import { Link } from 'react-router-dom';
import Logo from '../assets/GreenLogo.png';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between mb-24 lg:mb-0 px-6 h-16 bg-themeGray shadow-lg">
      <div className="flex items-center">
        <Link to="/dashboard"> 
          <img
            src={Logo}
            alt="Logo"
            className="h-9 w-9 mr-2 rounded-md"
          />
        </Link>
      </div>
      {/* Navigation Links (medium screens and up) */}
      {/* Add Page ROUTING once pages are created in the future */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/mycloset" className="text-lg font-semibold text-white hover:text-blue-500">
          My Closet
        </Link>
        <Link to="/ootd" className="md:text-lg font-semibold text-white hover:text-blue-500">
          Outfit of the Day
        </Link>
      </div>
      <div className="flex items-center">
        <button className="md:text-lg font-semibold text-white hover:text-blue-500">
          Logout
        </button>
      </div>
    </nav>
  );
}
