// src/pages/VerifyEmailPage.tsx
import { useState } from 'react';
//import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/GreenLogo.png";
import { Link } from 'react-router-dom';


export default function EnterEmailPassPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent page reload

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        process.env.NODE_ENV === 'production' 
        ? 'http://dressmeupproject.com/api/requestResetPassword' 
        : 'http://localhost:5001/api/requestResetPassword',
        { login: email }, // Matches the API expecting `login`
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setMessage('Reset password link has been sent to your email!');
      }
    } catch (err) {
      setError((err as any).response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen bg-themeLightBeige p-2">
      {/* Sidebar / Logo */}
      <Link to="/" className="lg:fixed lg:top-0 lg:left-0 m-6 hover:scale-105">
        <img src={logo} alt="DressMeUp Logo" className="w-36 h-36 lg:w-44 lg:h-44 rounded-lg" />
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative max-w-md w-full mx-4">
          {/* Brown rectangle header */}
          <div className="bg-amber-950 h-12 rounded-t-lg w-full"></div>

          {/* White content box */}
          <div className="bg-white border border-gray-200 rounded-b-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-themeDarkGray">
              Enter Email
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-themeGreen hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Submit'}
              </button>
            </form>

            {/* Success & Error Messages */}
            {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
