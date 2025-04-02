// src/pages/ResetPasswordPage.tsx
import React from 'react';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logo from "../assets/GreenLogo.png";
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const  [message, setMessage] = useState('');
  // const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }



    try {
      const response = await axios.post(
        process.env.NODE_ENV === 'production' 
        ? 'http://dressmeupproject.com/api/resetPassword' 
        : 'http://localhost:5001/api/resetPassword',
        { token, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
    
      if (response.status === 200) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 3000);

      }
    } catch (err) {
      setError((err as any).response?.data?.message || 'Server error in resetPassword API');
    } finally {
      setIsLoading(false);
    }
    
  };

  // if (success) {
  //   return (
  //     <div className="relative flex h-screen bg-themeLightBeige p-2">
  //       <div className="fixed left-0 top-0 h-full w-64 flex flex-col items-center p-4 bg-themeLightBeige">
  //         <img src={logo} alt="DressMeUp Logo" className="w-32 h-32 rounded-lg mb-4" />
  //       </div>
  //       <div className="flex-1 flex items-center justify-center ml-64">
  //         <div className="relative max-w-md w-full mx-4">
  //           <div className="bg-amber-950 h-12 rounded-t-lg w-full"></div>
  //           <div className="bg-white border border-gray-200 rounded-b-lg p-8 shadow-lg">
  //             <h2 className="text-2xl font-bold mb-6 text-center text-themeDarkGray">
  //               Password reset successful!
  //             </h2>
  //             <p className="text-center">Redirecting you to login...</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex h-screen bg-themeLightBeige p-2">
      {/* Sidebar matching MyCloset */}
      <Link to="/" className="lg:fixed lg:top-0 lg:left-0 m-6 hover:scale-105"> {/*Using link here instead of a button cause we dont need any crazy functionaliity logo on top left of login screen will literally jusst take user back to landing page */}
        <img src={logo} alt="DressMeUp Logo" className = "w-36 h-36 lg:w-44 lg:h-44 rounded-lg" />
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative max-w-md w-full mx-4">
          {/* Brown rectangle header */}
          <div className="bg-amber-950 h-12 rounded-t-lg w-full"></div>
          
          {/* White content box */}
          <div className="bg-white border border-gray-200 rounded-b-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-themeDarkGray">
              Reset Your Password
            </h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters long, contain one letter, one number, and one symbol."
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-themeGreen hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

              <p className = "text-red-700 text-md font-semibold max-w-[500px] pt-4 ">{message}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}