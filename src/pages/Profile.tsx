import React, { useState, useRef } from 'react';
import { useAppContext, LEVEL_THRESHOLDS, LEVEL_TITLES } from '../store';
import { User, Sparkles, Heart, Settings, ChevronRight, Volume2, Moon, Vibrate, Edit2, X, Check, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=ffd5dc',
];

export default function Profile() {
  const { bondExp, bondLevel, energy, fragments, settings, setSettings, userName, setUserName, userAvatar, setUserAvatar } = useAppContext();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const nextLevelExp = LEVEL_THRESHOLDS[bondLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressPercent = Math.min(100, (bondExp / nextLevelExp) * 100);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    if (editName.trim()) {
      setUserName(editName.trim());
    }
    setUserAvatar(editAvatar);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-full w-full px-6 pt-12 pb-32 relative">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-widest text-[#007AFF]">我的</h1>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full glass-panel hover:bg-black/5 transition-colors border-black/5"
        >
          <Settings size={20} className="text-[#007AFF]" />
        </button>
      </div>

      {/* User Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 mb-8 flex items-center gap-6 relative overflow-hidden border-black/5 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#007AFF]/50 to-[#0056b3] p-1 shadow-md shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#007AFF]/80" />
            )}
          </div>
        </div>
        <div className="flex-1 z-10">
          <h2 className="font-serif text-2xl font-bold mb-1 tracking-wider text-[#1D1D1F]">{userName}</h2>
          <p className="text-xs text-[#8E8E93] font-mono tracking-widest">ID: 88481234</p>
        </div>
        <button 
          onClick={() => {
            setEditName(userName);
            setEditAvatar(userAvatar);
            setIsEditing(true);
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-black/30 hover:text-black/60"
        >
          <Edit2 size={16} />
        </button>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-lg text-[#1D1D1F]">编辑个人资料</h3>
                <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-black/5 text-black/40">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-[#8E8E93] mb-2">昵称</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all"
                  placeholder="输入你的昵称"
                  maxLength={12}
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-[#8E8E93] mb-3">选择头像</label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar items-center">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 border-dashed border-black/20 bg-black/5 hover:bg-black/10 transition-all"
                  >
                    <Upload size={20} className="text-[#8E8E93]" />
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => setEditAvatar(null)}
                    className={clsx(
                      "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                      editAvatar === null ? "border-[#007AFF] shadow-md scale-110" : "border-transparent bg-black/5"
                    )}
                  >
                    <User size={24} className="text-[#8E8E93]" />
                  </button>
                  {AVATARS.map((avatar, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setEditAvatar(avatar)}
                      className={clsx(
                        "w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 transition-all",
                        editAvatar === avatar ? "border-[#007AFF] shadow-md scale-110" : "border-transparent bg-black/5"
                      )}
                    >
                      <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className="w-full py-3 bg-[#007AFF] text-white rounded-xl font-medium shadow-lg shadow-[#007AFF]/30 flex items-center justify-center gap-2 hover:bg-[#0056b3] transition-colors"
              >
                <Check size={18} />
                保存修改
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-2xl p-5 flex flex-col gap-2 border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8E8E93]">
            <Sparkles size={16} className="text-[#007AFF]" />
            <span className="text-xs font-medium tracking-widest">剩余能量</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#1D1D1F]">{energy}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-2xl p-5 flex flex-col gap-2 border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8E8E93]">
            <LibraryIcon size={16} className="text-[#007AFF]" />
            <span className="text-xs font-medium tracking-widest">收集进度</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#1D1D1F]">{fragments.length} <span className="text-lg text-black/30">/ 8</span></div>
        </motion.div>
      </div>

      {/* Bond Level Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-3xl p-6 mb-8 border-black/5 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#007AFF]/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-[#007AFF]" />
              <span className="font-serif font-semibold text-lg tracking-widest text-[#1D1D1F]">羁绊等级</span>
            </div>
            <span className="text-[#007AFF] font-bold font-mono">LV.{bondLevel}</span>
          </div>
          
          <div className="text-center mb-6">
            <span className="text-2xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#0056b3]">
              {LEVEL_TITLES[bondLevel - 1]}
            </span>
          </div>

          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-3">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#007AFF]/50 to-[#007AFF]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#8E8E93] font-mono">
            <span>{bondExp} EXP</span>
            <span>{nextLevelExp} EXP</span>
          </div>
        </div>
      </motion.div>

      {/* Settings List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-3xl overflow-hidden border-black/5 shadow-sm">
        <SettingToggle 
          icon={<Volume2 size={18} />} 
          title="语音播报" 
          checked={settings.voiceEnabled} 
          onChange={() => toggleSetting('voiceEnabled')} 
        />
        <SettingToggle 
          icon={<Moon size={18} />} 
          title="背景音乐" 
          checked={settings.bgmEnabled} 
          onChange={() => toggleSetting('bgmEnabled')} 
        />
        <SettingToggle 
          icon={<Vibrate size={18} />} 
          title="触觉反馈" 
          checked={settings.hapticsEnabled} 
          onChange={() => toggleSetting('hapticsEnabled')} 
        />
        <SettingItem title="关于星轨" hasBorder={false} onClick={() => navigate('/about')} />
      </motion.div>
    </div>
  );
}

function LibraryIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

function SettingToggle({ icon, title, checked, onChange }: { icon: React.ReactNode, title: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between p-5 bg-black/5 hover:bg-black/10 transition-colors border-b border-black/5">
      <div className="flex items-center gap-3 text-[#1D1D1F]">
        {icon}
        <span className="font-medium tracking-wide text-sm">{title}</span>
      </div>
      <button 
        onClick={onChange}
        className={clsx(
          "w-12 h-6 rounded-full transition-colors relative",
          checked ? "bg-[#34C759]" : "bg-black/10"
        )}
      >
        <motion.div 
          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
          animate={{ left: checked ? "calc(100% - 22px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

function SettingItem({ title, hasBorder = true, onClick }: { title: string, hasBorder?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-5 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer ${hasBorder ? 'border-b border-black/5' : ''}`}
    >
      <span className="font-medium tracking-wide text-sm text-[#1D1D1F]">{title}</span>
      <ChevronRight size={18} className="text-black/30" />
    </div>
  );
}
