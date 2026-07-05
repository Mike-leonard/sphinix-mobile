'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { Plus, MoreHorizontal } from 'lucide-react';

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
    <div>
      <h1 className="text-red-500">hello dashboard</h1>
    </div>
  );
}
