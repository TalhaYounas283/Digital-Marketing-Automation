import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, Calendar, ArrowUpRight, ArrowDownRight, Share2, FileText } from 'lucide-react';

const performanceData = [
  { date: 'Oct 1', revenue: 4000, spend: 2400, roas: 1.6 },
  { date: 'Oct 5', revenue: 3000, spend: 1398, roas: 2.1 },
  { date: 'Oct 10', revenue: 9800, spend: 2000, roas: 4.9 },
  { date: 'Oct 15', revenue: 3908, spend: 2780, roas: 1.4 },
  { date: 'Oct 20', revenue: 4800, spend: 1890, roas: 2.5 },
  { date: 'Oct 25', revenue: 3800, spend: 2390, roas: 1.5 },
  { date: 'Oct 30', revenue: 4300, spend: 3490, roas: 1.2 },
];

const channelData = [
    { name: 'Facebook', value: 45, color: '#3b82f6' },
    { name: 'Instagram', value: 30, color: '#ec4899' },
    { name: 'LinkedIn', value: 15, color: '#0ea5e9' },
    { name: 'Email', value: 10, color: '#8b5cf6' },
];

export const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 font-display">Detailed Reports</h2>
          <p className="text-slate-500 mt-1">Comprehensive performance analysis and exportable data.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
                <Calendar size={16} /> Last 30 Days
             </button>
             <button className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
                <Download size={16} /> Export CSV
             </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
            { label: 'Total Revenue', value: '$33,608', change: '+12.5%', positive: true },
            { label: 'Ad Spend', value: '$16,348', change: '+4.2%', positive: false },
            { label: 'Return on Ad Spend', value: '2.05x', change: '+8.1%', positive: true },
            { label: 'Conversion Rate', value: '3.2%', change: '-1.1%', positive: false },
         ].map((stat, i) => (
            <div key={i} className="minimal-card p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    <div className={`flex items-center text-xs font-bold ${stat.positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-full`}>
                        {stat.positive ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                        {stat.change}
                    </div>
                </div>
            </div>
         ))}
      </div>

      {/* Main Chart */}
      <div className="minimal-card p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue vs Spend</h3>
            <button className="text-slate-400 hover:text-slate-900"><Share2 size={18}/></button>
        </div>
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="Revenue" />
                <Line type="monotone" dataKey="spend" stroke="#f43f5e" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="Ad Spend" />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Channel Breakdown */}
         <div className="minimal-card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Channel Performance</h3>
            <div className="space-y-4">
                {channelData.map((channel, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-slate-700">{channel.name}</span>
                            <span className="text-slate-900">{channel.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${channel.value}%`, backgroundColor: channel.color }}></div>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* Downloadable Reports */}
         <div className="minimal-card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Generated Reports</h3>
            <div className="space-y-3">
                {[
                    { name: 'Q3 Financial Overview', date: 'Oct 15, 2023', size: '2.4 MB' },
                    { name: 'Campaign Performance: Summer Sale', date: 'Sep 30, 2023', size: '1.1 MB' },
                    { name: 'Lead Attribution Analysis', date: 'Sep 15, 2023', size: '856 KB' },
                    { name: 'Social Media Engagement', date: 'Sep 01, 2023', size: '3.2 MB' },
                ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                <FileText size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-500">{file.date} • {file.size}</p>
                            </div>
                        </div>
                        <Download size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};