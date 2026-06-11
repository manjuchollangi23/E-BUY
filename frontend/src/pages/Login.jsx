import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useScrollTop from '../hooks/useScrollTop';

const Login = () => {
  useScrollTop();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userInfo } = useContext(ShopContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // Navigation is handled by useEffect when userInfo updates
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-amazon-grayBg dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl animate-fadeInUp">
          
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <img src="https://img.icons8.com/color/48/shop.png" alt="E-BUY Logo" className="h-10 w-10" />
            </Link>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Sign in to your E-BUY account</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={submitHandler}>
            <Input 
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            
            <div className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
              </div>
              <Input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full mt-4"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
              New to E-BUY?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Create your account
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
