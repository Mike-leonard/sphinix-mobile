'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock Data
const salesData = [
  { name: 'Jan', incomes: 3000, expenses: 4000 },
  { name: 'Feb', incomes: 4000, expenses: 3000 },
  { name: 'Mar', incomes: 2000, expenses: 2000 },
  { name: 'Apr', incomes: 2780, expenses: 3908 },
  { name: 'May', incomes: 1890, expenses: 4800 },
  { name: 'Jun', incomes: 2390, expenses: 3800 },
  { name: 'Jul', incomes: 3490, expenses: 4300 },
  { name: 'Aug', incomes: 8063, expenses: 5400 },
  { name: 'Sep', incomes: 5000, expenses: 4800 },
  { name: 'Oct', incomes: 4000, expenses: 3800 },
  { name: 'Nov', incomes: 3000, expenses: 2400 },
  { name: 'Dec', incomes: 2000, expenses: 1398 },
];

const sparklineData1 = [{v: 10}, {v: 15}, {v: 8}, {v: 25}, {v: 18}, {v: 30}, {v: 22}];
const sparklineData2 = [{v: 20}, {v: 30}, {v: 15}, {v: 25}, {v: 10}, {v: 20}, {v: 15}];
const sparklineData3 = [{v: 10}, {v: 15}, {v: 35}, {v: 25}, {v: 45}, {v: 30}, {v: 50}];
const sparklineData4 = [{v: 40}, {v: 30}, {v: 20}, {v: 35}, {v: 15}, {v: 25}, {v: 10}];

const radarData = [
  { subject: 'Shoes', A: 120, B: 110, fullMark: 150 },
  { subject: 'Jeans', A: 98, B: 130, fullMark: 150 },
  { subject: 'Accessories', A: 86, B: 130, fullMark: 150 },
  { subject: 'T-shirts', A: 99, B: 100, fullMark: 150 },
  { subject: 'Outwear', A: 85, B: 90, fullMark: 150 },
];

const latestProducts = [
  { id: 1, name: 'PSG Stadium 20/21', variants: 3, sku: '8600844', category: 'Jerseys', date: '12.11.2020', status: 'Published', img: '👕' },
  { id: 2, name: 'Los Angeles Lakers City', variants: 5, sku: '8608647', category: 'Jerseys', date: '12.11.2020', status: 'Pending', img: '🏀' },
  { id: 3, name: 'Miami Heat Courtside', variants: 4, sku: '8609824', category: 'Outwear', date: '10.11.2020', status: 'Published', img: '🧥' },
  { id: 4, name: 'Liverpool FC 20/21 Stadium', variants: 3, sku: '8609474', category: 'Jerseys', date: '07.11.2020', status: 'Published', img: '⚽' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Sales Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2  style={{fontSize: "var(--font-size-h2-settings, var(--font-size-h2-default))"}} className="text-lg font-bold text-slate-800 dark:text-white">Sales Overview</h2>
          <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-primary, var(--font-size-button-default))"}}  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Offer
          </Button>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-slate-900 dark:text-white">$80,630</div>
            <div className="flex items-center text-sm font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
              ↑ 6.7%
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> Incomes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div> Expenses
            </div>
            <select className="border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Year</option>
              <option>Month</option>
              <option>Week</option>
            </select>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncomes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="incomes" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncomes)" />
              <Area type="monotone" dataKey="expenses" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Daily Income */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-sm text-white flex flex-col justify-between h-[120px]">
          <div className="text-sm font-medium text-blue-100">Daily Income</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold">$ 345</div>
            <div className="w-[80px] h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData1}>
                  <Line type="monotone" dataKey="v" stroke="#ffffff" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: Daily Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Daily Expense</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">$ 380</div>
            <div className="w-[80px] h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData2}>
                  <Bar dataKey="v" fill="#ec4899" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Weekly Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Weekly Income</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">$ 5380</div>
            <div className="w-[80px] h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData3}>
                  <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4: Weekly Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Weekly Expense</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">$ 4320</div>
            <div className="w-[80px] h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData4}>
                  <Bar dataKey="v" fill="#f97316" radius={[2, 2, 0, 0]} isAnimationActive={false} barSize={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Categories (Radar Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3  style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-sm font-bold text-slate-800 dark:text-white mb-4">Top Selling Categories</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11}} />
                <Radar name="Incomes" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Expenses" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Added Products (List) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3  style={{fontSize: "var(--font-size-h3-section, var(--font-size-h3-default))"}} className="text-sm font-bold text-slate-800 dark:text-white">Latest Added Products</h3>
            <Button variant="none" size="none" style={{fontSize: "var(--font-size-button-default, var(--font-size-button-default))"}}  className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {latestProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-200 dark:border-slate-700">
                    {product.img}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.variants} Variants</div>
                  </div>
                </div>

                <div className="hidden sm:block text-xs font-medium text-slate-500">
                  <span className="text-slate-400">SKU:</span> {product.sku}
                </div>

                <div className="hidden md:block text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {product.category}
                </div>

                <div className="text-sm text-slate-500">
                  {product.date}
                </div>

                <div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                    product.status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                      : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
