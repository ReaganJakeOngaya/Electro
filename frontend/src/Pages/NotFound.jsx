// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../Components/common/utils/auth';

const NotFound = () => {
  const user = getUser();
  const homePath = user ? '/user-dashboard' : '/';

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Decorative element */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-3xl bg-black text-white flex items-center justify-center mx-auto shadow-2xl"
               style={{ boxShadow: '0 20px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
            <span className="text-6xl font-black tracking-tighter">404</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border border-zinc-200 flex items-center justify-center text-black text-xs font-black shadow-sm">
            ?
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tighter text-black mb-2">
          Page not found
        </h1>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to={homePath}
          className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          ← Back to {user ? 'Dashboard' : 'Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;