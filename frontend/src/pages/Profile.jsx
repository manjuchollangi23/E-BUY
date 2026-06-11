import React, { useState, useContext, useEffect } from 'react';
import { FaUserEdit, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useScrollTop from '../hooks/useScrollTop';

const Profile = () => {
  useScrollTop();
  const { userInfo, updateProfile } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await updateProfile({ id: userInfo._id, name, email, password });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-8 lg:py-12 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg font-black text-2xl">
          {userInfo?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500" />
            Verified Account
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaUserEdit className="text-blue-500" />
            Edit Information
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name"
              type="text"
              icon={FaUserEdit}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              label="Email Address"
              type="email"
              icon={FaEnvelope}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="New Password"
                type="password"
                icon={FaLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
              <Input 
                label="Confirm New Password"
                type="password"
                icon={FaLock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="px-10"
              loading={loading}
            >
              Update Profile
            </Button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default Profile;
