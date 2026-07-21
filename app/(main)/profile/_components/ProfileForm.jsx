'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { updateProfileName } from '@/actions/users';

export default function ProfileForm({ user }) {
  const [name, setName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    const res = await updateProfileName(name);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.message);
    }
    
    setLoading(false);
  };

  const joiningDate = user.createdAt 
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(user.createdAt))
    : 'Unknown';

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md text-sm mb-4">
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300 flex items-center">
              Email Address
              {user.emailVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </span>
              )}
            </label>
            <input 
              type="email" 
              value={user.email} 
              disabled
              className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Joining Date
          </label>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {joiningDate}
          </div>
        </div>
        
        <Button 
          variant="none" 
          size="none" 
          disabled={loading || name === user.name}
          style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}}  
          type="submit" 
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
