import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Bell, Shield, Eye, User, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../constants/roles';

const PAGE_TITLES = {
  '/dashboard':    { title: 'Dashboard',    description: 'Your financial overview' },
  '/transactions': { title: 'Transactions', description: 'Manage your transactions' },
  '/insights':     { title: 'Insights',     description: 'Spending patterns & analysis' },
};

export default function Navbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode, role } = useApp();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/dashboard'];
  const isAdmin = role === ROLES.ADMIN;

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0 gap-3 glass-panel border-b border-border"
    >
      {/* Left: Hamburger (mobile only) + Page title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* ── Hamburger — mobile/tablet only, hidden on desktop via CSS ── */}
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="bg-secondary border border-border rounded-xl w-9 h-9 items-center justify-center shrink-0 cursor-pointer transition-all hover:bg-secondary/80"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </button>
        <style>{`
          @media (max-width: 1023px) { #mobile-menu-btn { display: flex; } }
          @media (min-width: 1024px) { #mobile-menu-btn { display: none; } }
        `}</style>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
            {page.title}
          </h1>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">
            {page.description}
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Role badge — hidden on very small screens */}
        <div
          className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
            isAdmin
              ? 'bg-brand-500/10 border-brand-500/20 text-brand-300'
              : 'bg-secondary border-border text-muted-foreground'
          }`}
        >
          {isAdmin ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          <span className="capitalize">{role}</span>
        </div>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-border bg-secondary hover:scale-105"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-brand-400" />
          )}
        </button>

        {/* Notification bell */}
        <button
          className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-border bg-secondary hover:scale-105 relative"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
            style={{ background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.8)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          title="Profile"
        >
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </header>
  );
}
