// src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/GreenLogo.png";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) throw new Error('Missing verification token');
        
        const response = await axios.get(`/auth/verify-email?token=${token}`);
        
        if (response.data.message) {
          setStatus('success');
          setMessage(response.data.message);
          setTimeout(() => navigate('/login'), 5000);
        }
      } catch (error) {
        setStatus('error');
        let errorMessage = 'Failed to verify email';
        
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.error || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="relative flex h-screen bg-themeLightBeige p-2">
      {/* Sidebar matching MyCloset */}
      <div className="fixed left-0 top-0 h-full w-64 flex flex-col items-center p-4 bg-themeLightBeige">
        <img
          src={logo}
          alt="DressMeUp Logo"
          className="w-32 h-32 rounded-lg mb-4"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {status === 'loading' && (
            <div className="text-2xl text-themeGreen">Verifying your email...</div>
          )}

          {status === 'success' && (
            <div className="bg-themeGray p-8 rounded-lg text-center shadow-lg">
              <div className="text-3xl text-themeGreen mb-4">✓</div>
              <h2 className="text-2xl text-white mb-4">{message}</h2>
              <p className="text-white mb-4">
                Redirecting to login in <span className="text-themeGreen">5</span> seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-themeGray p-8 rounded-lg text-center shadow-lg">
              <div className="text-3xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-2xl text-white mb-4">Verification Failed</h2>
              <p className="text-white mb-6">{message}</p>
              <button
                onClick={() => navigate('/register')}
                className="bg-themeGreen text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Try Registering Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;