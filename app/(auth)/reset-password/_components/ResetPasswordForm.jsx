'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/actions/auth';
import AuthInput from '@/components/auth/AuthInput';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const res = await resetPasswordAction(password);

    if (!res.success) {
      setError(res.message);
      setLoading(false);
    } else {
      setSuccess("Your password has been reset successfully! Redirecting...");
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  return (
    <div className="flex-1 max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuthHeader
          title="Create New Password"
          descriptionPrefix="Please enter your"
          descriptionSuffix="new password"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="password"
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="pt-2">
            <AuthSubmitButton 
              loading={loading}
              defaultText="Update Password"
              loadingText="Updating..."
              disabled={!!success}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
