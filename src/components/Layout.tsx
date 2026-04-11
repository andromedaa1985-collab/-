import React, { useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sparkles, Library, User, Compass, Book, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { useAppContext } from '../store';
import Particles from './Particles';

export default function Layout() {
  const { settings } = useAppContext();

  return (
    <div className="fixed inset-0 bg-apple-bg text-apple-text overflow-hidden flex flex-col font-sans transition-colors duration-300 pt-[max(env(safe-area-inset-top),48px)] pb-[env(safe-area-inset-bottom)]">
      {/* Global Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-apple-bg">
        
        {/* Deep glowing orbs for tech/mystical vibe */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-apple-accent/20 blur-[120px] mix-blend-screen dark:mix-blend-screen mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/15 blur-[150px] mix-blend-screen dark:mix-blend-screen mix-blend-multiply"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-500/10 blur-[100px] mix-blend-screen dark:mix-blend-screen mix-blend-multiply"></div>

        <div className="absolute inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-[20px]"></div>

        {/* Subtle Noise Texture for Premium Feel */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 relative z-10 no-scrollbar">
        <Outlet />
      </div>

      {/* Premium Glass Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe">
        <div className="absolute inset-0 bg-apple-surface backdrop-blur-2xl border-t border-apple-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"></div>
        <div className="relative flex justify-around items-center h-20 px-1 sm:px-2 max-w-md mx-auto">
          <NavItem to="/app" end icon={<Sparkles size={20} />} label="塔罗" />
          <NavItem to="/app/bazi" icon={<Compass size={20} />} label="八字" />
          <NavItem to="/app/simulator" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 9 6-6"/><path d="M15 15v6"/><path d="M21 3v6"/><path d="M21 3h-6"/><path d="M3 15v6"/><path d="M3 21h6"/><path d="M3 3v6"/><path d="M3 9h6"/><path d="M9 21v-6"/><path d="M9 3v6"/><path d="M15 3v6"/><path d="M15 21v-6"/></svg>} label="沙盘" />
          <NavItem to="/app/diary" icon={<Book size={20} />} label="日记" />
          <NavItem to="/app/guardian" icon={<Moon size={20} />} label="守护" />
          <NavItem to="/app/profile" icon={<User size={20} />} label="我的" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, end }: { to: string, icon: React.ReactNode, label: string, end?: boolean }) {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => clsx(
        "relative flex flex-col items-center justify-center w-14 sm:w-16 h-full transition-colors duration-300",
        isActive ? "text-apple-accent" : "text-apple-text-muted hover:text-apple-text"
      )}
    >
      {({ isActive }) => (
        <>
          <motion.div
            animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {icon}
          </motion.div>
          <span className="text-[10px] mt-1.5 font-medium tracking-widest">{label}</span>
          
          {isActive && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute top-0 w-8 h-0.5 bg-apple-accent rounded-full shadow-[0_0_12px_rgba(107,138,255,0.8)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
