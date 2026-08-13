import React from 'react';
import { Mail, Clock, HelpCircle, Bug } from 'lucide-react';
import ContactForm from './_components/ContactForm';

export const metadata = {
  title: 'Contact Support & Feedback',
  description: 'Have questions about smartphone benchmarks, editorial inquiries, or bug reports? Send us a message and our team will get back to you.'
};

export default function ContactSupportPage() {
  return (
    <div className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
            <Mail className="w-4 h-4" /> 24/7 Support Desk
          </div>
          <h1 style={{ fontSize: "var(--font-size-h1-default, var(--font-size-h1-default))" }} className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Support & Feedback
          </h1>
          <p style={{ fontSize: "var(--font-size-p-subtitle, var(--font-size-p-default))" }} className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Have questions about smartphone benchmarks, editorial inquiries, or bug reports? Send us a message and our team will get back to you.
          </p>
        </div>

        {/* Support Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">General Enquiries</h3>
            <p className="text-xs text-slate-500">Questions about smartphone specifications or site content.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Bug Reports</h3>
            <p className="text-xs text-slate-500">Notice inaccurate phone data or UI layout issues?</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Fast Response</h3>
            <p className="text-xs text-slate-500">Our editorial team responds within 24 to 48 hours.</p>
          </div>
        </div>

        {/* Contact Form Client Component */}
        <ContactForm />

      </div>
    </div>
  );
}
