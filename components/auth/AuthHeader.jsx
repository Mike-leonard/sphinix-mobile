import React from 'react';
import Link from 'next/link';

export default function AuthHeader({ title, descriptionPrefix, descriptionSuffix }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {descriptionPrefix}{' '}
        <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'} className="text-brand-500 hover:underline">
          Sphinix Mobile
        </Link>{' '}
        {descriptionSuffix}
      </p>
    </>
  );
}
