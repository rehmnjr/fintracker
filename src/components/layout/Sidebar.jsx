import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  DollarSign,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../constants/roles';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { role, toggleRole } = useApp();
  const isAdmin = role === ROLES.ADMIN;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR  — always visible on lg+ screens
          Hidden on mobile/tablet via CSS media query (see <style>)
      ───────────────────────────────────────────────────────────── */}
      <aside
        id="desktop-sidebar"
        className="glass-panel border-r border-border"
        style={{
          position: 'relative',
          flexShrink: 0,
          flexDirection: 'column',
          width: collapsed ? '4rem' : '15rem',
          minHeight: '100vh',
          overflow: 'visible',
          zIndex: 10,
          transition: 'width 0.3s ease',
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          isAdmin={isAdmin}
          role={role}
          toggleRole={toggleRole}
          navItems={navItems}
        />

        {/* Collapse toggle button — sits on the border */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute',
            top: '1.28rem',
            right: '0.95rem',
            width: '2rem',
            height: '2rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 0 16px rgba(99,102,241,0.6)',
            border: '2px solid rgba(99,102,241,0.3)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4 text-white" />
            : <ChevronLeft className="h-4 w-4 text-white" />}
        </button>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE DRAWER  — slides in from left on small/tablet screens
          Hidden on lg+ via CSS media query (see <style>)
      ───────────────────────────────────────────────────────────── */}
      <aside
        id="mobile-sidebar"
        className="bg-background/95 backdrop-blur-xl border-r border-border"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '17rem',
          flexDirection: 'column',
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2rem',
            height: '2rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          <X className="h-4 w-4" />
        </button>

        <SidebarContent
          collapsed={false}
          isAdmin={isAdmin}
          role={role}
          toggleRole={toggleRole}
          navItems={navItems}
          onNavClick={onMobileClose}
        />
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          Responsive CSS — controls which sidebar mode is visible
      ───────────────────────────────────────────────────────────── */}
      <style>{`
        /* Mobile / tablet  (<1024px): show drawer, hide desktop sidebar */
        @media (max-width: 1023px) {
          #desktop-sidebar           { display: none !important; }
          #mobile-sidebar            { display: flex !important; }
        }

        /* Desktop (≥1024px): show persistent sidebar, hide drawer */
        @media (min-width: 1024px) {
          #desktop-sidebar           { display: flex !important; }
          #mobile-sidebar            { display: none !important; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared sidebar body — reused in both desktop and mobile modes
═══════════════════════════════════════════════════════════════════ */
function SidebarContent({ collapsed, isAdmin, role, toggleRole, navItems, onNavClick }) {
  return (
    <>
      {/* Logo */}
      <div
        className="border-b border-border"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 1rem',
          flexShrink: 0,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <div
          className="glow-indigo"
          style={{
            flexShrink: 0,
            width: '2rem',
            height: '2rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          }}
        >
          <DollarSign className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <p className="text-foreground" style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              FinTracker
            </p>
            <p className="text-muted-foreground" style={{ fontSize: '0.625rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Personal Finance
            </p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.5rem', overflowY: 'auto' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border mb-1 ${isActive
                ? 'nav-active border-brand-500/30 text-brand-300'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        onClick={toggleRole}
        title={`Switch to ${isAdmin ? 'Viewer' : 'Admin'}`}
        className="glass-card mb-4 mx-2 p-3 transition-colors shrink-0 !rounded-xl"
        style={{ cursor: 'pointer' }}
      >
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {isAdmin
              ? <Shield className="h-4 w-4 text-brand-400" />
              : <Eye className="h-4 w-4" style={{ color: 'rgba(148,163,184,0.7)' }} />}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
              <span className="text-muted-foreground" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Current Role</span>
              <span className={`badge text-[10px] flex-shrink-0 ${isAdmin ? 'bg-brand-500/20 text-brand-300' : 'bg-secondary text-secondary-foreground'}`}>
                {isAdmin ? <Shield className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role}</span>
              </span>
            </div>
            <div className={`w-full rounded-lg py-1.5 text-center text-xs font-medium transition-all ${isAdmin ? 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground' : 'btn-primary text-xs py-1.5'}`}>
              {isAdmin ? 'Switch to Viewer' : 'Switch to Admin'}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
