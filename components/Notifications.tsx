import React, { useState } from 'react';
import { Bell, Check, Clock, AlertTriangle, Info, X } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Campaign "Summer Sale" budget reached', message: 'Your campaign has reached 90% of its daily budget.', time: '10 mins ago', type: 'warning', read: false },
  { id: 2, title: 'New Lead Qualified', message: 'Tech Solutions Inc. has been marked as Qualified by AI.', time: '1 hour ago', type: 'success', read: false },
  { id: 3, title: 'System Update', message: 'AutoMarketer AI will undergo maintenance at 2 AM.', time: '5 hours ago', type: 'info', read: true },
  { id: 4, title: 'Export Ready', message: 'Your Q3 Report is ready for download.', time: '1 day ago', type: 'success', read: true },
  { id: 5, title: 'Payment Failed', message: 'We could not process your payment for the monthly subscription.', time: '2 days ago', type: 'error', read: true },
];

export const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const markAllRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
      setNotifications(notifications.filter(n => n.id !== id));
  }

  const getIcon = (type: string) => {
      switch(type) {
          case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
          case 'success': return <Check size={18} className="text-emerald-500" />;
          case 'error': return <AlertTriangle size={18} className="text-rose-500" />;
          default: return <Info size={18} className="text-blue-500" />;
      }
  };

  const getBgColor = (type: string) => {
    switch(type) {
        case 'warning': return 'bg-amber-50';
        case 'success': return 'bg-emerald-50';
        case 'error': return 'bg-rose-50';
        default: return 'bg-blue-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
       <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 font-display">Notifications</h2>
          <p className="text-slate-500 mt-1">Stay updated with your marketing activities.</p>
        </div>
        <button 
            onClick={markAllRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
            Mark all as read
        </button>
      </div>

      <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
              All
          </button>
          <button 
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'unread' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
              Unread
          </button>
      </div>

      <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                      <Bell size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold">No notifications</h3>
                  <p className="text-slate-500 text-sm mt-1">You're all caught up!</p>
              </div>
          ) : (
            filteredNotifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className={`minimal-card p-4 flex items-start gap-4 transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''}`}
                >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                {notification.title}
                            </h4>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {notification.time}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            {notification.message}
                        </p>
                    </div>

                    <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-slate-300 hover:text-slate-500 p-1 hover:bg-slate-50 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))
          )}
      </div>
    </div>
  );
};