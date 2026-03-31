import React, { useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sparkles, Library, User, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { useAppContext } from '../store';
import Particles from './Particles';

export default function Layout() {
  const { settings } = useAppContext();

  return (
    <div className="h-screen w-full bg-[#F2F2F7] dark:bg-gray-900 text-[#1D1D1F] dark:text-gray-100 overflow-hidden flex flex-col font-sans relative transition-colors duration-300">
      {/* Global Atmospheric Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#F2F2F7] dark:bg-gray-900 transition-colors duration-300">
        
        <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[40px] transition-colors duration-300"></div>

        {/* Particle Effects (Now Large Gradient Orbs) */}
        <Particles />

        {/* Subtle Noise Texture for Premium Feel */}
        <div 
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 relative z-10 no-scrollbar">
        <Outlet />
      </div>

      {/* Premium Glass Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe">
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] transition-colors duration-300"></div>
        <div className="relative flex justify-around items-center h-20 px-4 max-w-md mx-auto">
          <NavItem to="/" icon={<Sparkles size={22} />} label="占卜" />
          <NavItem to="/community" icon={<Compass size={22} />} label="社区" />
          <NavItem to="/collection" icon={<Library size={22} />} label="图鉴" />
          <NavItem to="/profile" icon={<User size={22} />} label="我的" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "relative flex flex-col items-center justify-center w-16 h-full transition-colors duration-300",
        isActive ? "text-[#007AFF] dark:text-blue-400" : "text-[#8E8E93] dark:text-gray-400 hover:text-[#1D1D1F] dark:hover:text-gray-200"
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
              className="absolute top-0 w-8 h-0.5 bg-[#007AFF] dark:bg-blue-400 rounded-full shadow-[0_0_8px_rgba(0,122,255,0.4)] dark:shadow-[0_0_8px_rgba(96,165,250,0.4)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
