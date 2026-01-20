import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, BarChart3, Settings, LogOut, Hexagon, Menu, X, Sparkles, Mail, Users, Workflow, Crosshair } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string, onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm
      ${isActive 
        ? 'bg-slate-100 text-slate-900 font-semibold' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`
    }
  >
    <span className="relative z-10">
      {icon}
    </span>
    <span className="relative z-10">{label}</span>
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/generate': return 'AI Studio';
      case '/competitors': return 'Competitor Analysis';
      case '/email': return 'Email Campaigns';
      case '/leads': return 'Lead Manager';
      case '/schedule': return 'Scheduler';
      case '/automation': return 'Automation Hub';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      default: return 'AutoMarketer';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
               <Hexagon size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight font-display leading-none">AutoMarketer</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform</div>
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Overview" />
          <NavItem to="/generate" icon={<Sparkles size={18} />} label="AI Studio" />
          <NavItem to="/competitors" icon={<Crosshair size={18} />} label="Competitors" />
          <NavItem to="/email" icon={<Mail size={18} />} label="Email Marketing" />
          <NavItem to="/leads" icon={<Users size={18} />} label="Lead Scoring" />
          <NavItem to="/schedule" icon={<Calendar size={18} />} label="Scheduler" />
          
          <div className="px-4 py-3 mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">System</div>
          <NavItem to="/automation" icon={<Workflow size={18} />} label="Automation Hub" />
          <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 mb-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold uppercase">
              {user?.name.slice(0, 2) || 'US'}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
               <p className="text-xs text-slate-500 truncate">Project Lead</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-2 py-1.5 text-slate-500 hover:text-red-600 w-full transition-colors text-sm font-medium">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 p-1.5 rounded text-white">
                <Hexagon size={18} />
             </div>
             <span className="text-base font-bold text-slate-900">AutoMarketer</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/generate" icon={<Sparkles size={18} />} label="AI Studio" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/competitors" icon={<Crosshair size={18} />} label="Competitors" onClick={() => setIsMobileMenuOpen(false)} />
           <NavItem to="/email" icon={<Mail size={18} />} label="Email Marketing" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/leads" icon={<Users size={18} />} label="Lead Scoring" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/schedule" icon={<Calendar size={18} />} label="Scheduler" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/automation" icon={<Workflow size={18} />} label="Automation Hub" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>
        <div className="p-4 border-t border-slate-100">
             <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 w-full text-sm font-medium">
               <LogOut size={16} /> Sign Out
             </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-slate-50">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:hidden bg-white sticky top-0 z-30">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 hover:text-slate-900">
               <Menu size={24} />
             </button>
             <span className="font-bold text-slate-900 text-lg">{getPageTitle()}</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold uppercase">
             {user?.name.slice(0, 2) || 'AM'}
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative scroll-smooth">
            <div className="max-w-6xl mx-auto h-full">
              {children}
            </div>
        </div>
      </main>
    </div>
  );
};