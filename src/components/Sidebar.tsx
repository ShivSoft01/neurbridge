import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Gamepad2, 
  Heart, 
  MessageSquare, 
  LogOut,
  Settings
} from 'lucide-react';
import { theme } from '../theme';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/games', icon: Gamepad2, label: 'Game Center' },
    { path: '/calm-zone', icon: Heart, label: 'Calm Zone' },
    { path: '/ai-chat', icon: MessageSquare, label: 'AI Learning' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-screen p-4 flex flex-col" style={{ backgroundColor: theme.secondary, color: theme.sidebarText }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">NeuroBridge</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-opacity-20 bg-white' 
                      : 'hover:bg-opacity-10 hover:bg-white'
                  }`}
                  style={{ color: theme.sidebarText }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
        style={{ color: theme.sidebarText }}
        onClick={() => {
          // Handle logout
          window.location.href = '/login';
        }}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar; 