import React from 'react';
import Link from 'next/link';
import { getDevices } from '@/actions/devices';

import { getUsers } from '@/actions/users';
import { getGoogleMetrics } from '@/actions/analytics';
import SiteKitDashboard from './_components/SiteKitDashboard';
import PublishTrendsChart from './_components/PublishTrendsChart';
import { Smartphone, FileText, Users, Star, Plus, Settings, Edit3, LineChart, MousePointerClick, Search, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { allBlogs } from '@/actions/blogs';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch real-time data
  const [devices, blogs, users, googleMetrics] = await Promise.all([
    getDevices(),
    allBlogs(),
    getUsers(),
    getGoogleMetrics()
  ]);

  // Devices calculations
  const totalPhones = devices.length;
  const publishedPhones = devices.filter(d => d.status === 'published').length;
  const draftPhones = devices.filter(d => d.status === 'draft').length;
  const topRatedPhones = devices.filter(d => d.isTopRated).length;

  // Blogs calculations
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const draftBlogs = blogs.filter(b => b.status === 'draft').length;

  // Sorting to get the latest content (assuming they have id or are appended at the end, but usually best to sort by a date if available. The JSON probably has created at or we just reverse the array)
  // Reversing the array to show the most recent ones first
  const recentPhones = [...devices].reverse().slice(0, 6);
  const recentBlogs = [...blogs].reverse().slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your Sphinix Mobile platform data.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/phones/new">
            <Button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm">
              <Plus className="w-4 h-4" /> Add Phone
            </Button>
          </Link>
          <Link href="/dashboard/blogs/new">
            <Button variant="secondary" className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm">
              <FileText className="w-4 h-4" /> Add Blog
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline" className="flex items-center gap-2 rounded-xl border-slate-200 dark:border-slate-800">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1: Total Phones */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[130px] relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Phones</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalPhones}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 z-10 relative">
            <span className="text-emerald-500 font-medium">{publishedPhones} Published</span> • {draftPhones} Drafts
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </div>

        {/* Card 2: Total Blogs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[130px] relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Articles</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalBlogs}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 z-10 relative">
            <span className="text-emerald-500 font-medium">{publishedBlogs} Published</span> • {draftBlogs} Drafts
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[130px] relative overflow-hidden group">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Registered Users</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{users?.length || 0}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4 z-10 relative">
            Active members
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
        </div>

        {/* Card 4: Top Rated Phones */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[130px] relative overflow-hidden group text-white">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="text-sm font-medium text-brand-100 mb-1">Top Rated Phones</div>
              <div className="text-3xl font-bold">{topRatedPhones}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-brand-100 mt-4 z-10 relative">
            Highlighting best devices
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
        </div>
      </div>

      {/* Publishing Trends */}
      <div className="mb-8 w-full">
        <PublishTrendsChart totalPhones={totalPhones} totalBlogs={totalBlogs} />
      </div>

      {/* Google Site Kit Detailed Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Site Kit Summary
              {googleMetrics.isDummy && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-2 py-0.5 rounded-md">Demo Data</span>
              )}
            </h2>
            <p className="text-sm text-slate-500">Analytics and Search Console data (Last 28 days)</p>
          </div>
        </div>

        {googleMetrics.setupRequired && googleMetrics.error === 'credentials_missing' ? (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">Google Site Kit Setup Required</h3>
              <div className="text-sm text-amber-700 dark:text-amber-400/80 mt-1 mb-3 space-y-2">
                <p>1. Create a Google Cloud Platform project, enable Analytics/Search Console APIs, and generate a Service Account JSON Key.</p>
                <p>2. Place that key inside your project folder and name it exactly <strong>data/google-credentials.json</strong>.</p>
                <p>3. Add the email address of that Service Account to your Google Analytics and Search Console properties as a "Viewer".</p>
              </div>
              <Link href="/dashboard/settings/analytics">
                <Button size="sm" variant="outline" className="bg-white/50 hover:bg-white dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30">
                  Configure Settings
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <SiteKitDashboard data={googleMetrics.data} />
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Latest Added Phones */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recently Added Phones</h3>
            <Link href="/dashboard/phones" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {recentPhones.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No phones added yet.</div>
            ) : (
              recentPhones.map((phone) => (
                <div key={phone.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                      {phone.images && phone.images[0] ? (
                        <img src={phone.images[0]} alt={phone.name} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{phone.name}</div>
                      <div className="text-xs font-medium text-slate-500 mt-1">{phone.brand}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${phone.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
                      }`}>
                      {phone.status}
                    </span>
                    <Link href={`/dashboard/phones/${phone.id}/edit`}>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 flex items-center justify-center text-slate-400 transition-colors" title="Edit Phone">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Articles */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Articles</h3>
            <Link href="/dashboard/blogs" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {recentBlogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No articles written yet.</div>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                      {blog.coverImage ? (
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px] sm:max-w-[250px]">{blog.title}</div>
                      <div className="text-xs font-medium text-slate-500 mt-1">{blog.category || 'Uncategorized'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${blog.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
                      }`}>
                      {blog.status}
                    </span>
                    <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 flex items-center justify-center text-slate-400 transition-colors" title="Edit Blog">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
