import React, { useState, useRef } from 'react';
import { useAppContext, LEVEL_THRESHOLDS, LEVEL_TITLES } from '../store';
import { User, Sparkles, Heart, Settings, ChevronRight, Volume2, Moon, Vibrate, Edit2, X, Check, Upload, Compass } from 'lucide-react';
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
  const { bondExp, bondLevel, energy, fragments, settings, setSettings, userName, setUserName, userAvatar, setUserAvatar, profiles, setProfiles, activeProfileId, setActiveProfileId } = useAppContext();
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
    <div className="min-h-full w-full px-6 pt-4 pb-32 relative text-apple-text">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-sans text-3xl font-bold tracking-widest text-[#6B8AFF]">我的</h1>
        <button 
          onClick={() => navigate('/app/settings')}
          className="p-2 rounded-full glass-panel hover:bg-apple-surface-hover transition-colors border-apple-border"
        >
          <Settings size={20} className="text-[#6B8AFF]" />
        </button>
      </div>

      {/* User Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-apple-surface backdrop-blur-xl rounded-3xl p-6 mb-8 flex items-center gap-6 relative overflow-hidden border border-apple-border shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#6B8AFF]/20 to-transparent rounded-bl-full pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4F46E5]/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6B8AFF] to-[#4F46E5] p-[2px] shadow-[0_0_20px_rgba(107,138,255,0.4)] shrink-0 relative z-10">
          <div className="w-full h-full rounded-full bg-apple-surface flex items-center justify-center overflow-hidden border-2 border-[#141419]">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[#6B8AFF]" />
            )}
          </div>
        </div>
        <div className="flex-1 z-10">
          <h2 className="font-sans text-2xl font-bold mb-1 tracking-wider text-apple-text drop-shadow-md">{userName}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6B8AFF] animate-pulse shadow-[0_0_8px_rgba(107,138,255,0.8)]"></span>
            <p className="text-xs text-[#6B8AFF] font-mono tracking-widest">ID: 88481234</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditName(userName);
            setEditAvatar(userAvatar);
            setIsEditing(true);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-apple-surface hover:bg-apple-surface-hover border border-apple-border transition-colors text-apple-text-muted hover:text-apple-text z-10 shadow-sm"
        >
          <Edit2 size={14} />
        </button>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-apple-border relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans font-bold text-lg text-apple-text">编辑个人资料</h3>
                <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-apple-surface-hover text-apple-text-muted">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-apple-text-muted mb-2">昵称</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-apple-surface border border-apple-border rounded-xl px-4 py-3 text-sm text-apple-text focus:outline-none focus:ring-2 focus:ring-[#6B8AFF]/50 transition-all"
                  placeholder="输入你的昵称"
                  maxLength={12}
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium text-apple-text-muted mb-3">选择头像</label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar items-center">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 border-dashed border-apple-border bg-apple-surface hover:bg-apple-surface-hover transition-all"
                  >
                    <Upload size={20} className="text-apple-text-muted" />
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
                      editAvatar === null ? "border-[#6B8AFF] shadow-[0_4px_15px_rgba(107,138,255,0.3)] scale-110" : "border-transparent bg-apple-surface"
                    )}
                  >
                    <User size={24} className="text-apple-text-muted" />
                  </button>
                  {AVATARS.map((avatar, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setEditAvatar(avatar)}
                      className={clsx(
                        "w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 transition-all",
                        editAvatar === avatar ? "border-[#6B8AFF] shadow-[0_4px_15px_rgba(107,138,255,0.3)] scale-110" : "border-transparent bg-apple-surface"
                      )}
                    >
                      <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className="w-full py-3 bg-[#6B8AFF] text-white rounded-xl font-medium shadow-[0_4px_20px_rgba(107,138,255,0.3)] flex items-center justify-center gap-2 hover:bg-[#4F46E5] transition-colors"
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
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-apple-surface backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-3 border border-apple-border shadow-[0_8px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#6B8AFF]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-apple-text-muted relative z-10">
            <div className="p-1.5 rounded-lg bg-[#6B8AFF]/10 border border-[#6B8AFF]/20">
              <Sparkles size={14} className="text-[#6B8AFF]" />
            </div>
            <span className="text-xs font-medium tracking-widest">剩余能量</span>
          </div>
          <div className="text-3xl font-sans font-bold text-apple-text relative z-10 drop-shadow-md">{energy}</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }} 
          onClick={() => navigate('/app/collection')}
          className="bg-apple-surface backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-3 border border-apple-border shadow-[0_8px_20px_rgba(0,0,0,0.3)] relative overflow-hidden cursor-pointer hover:border-apple-gold/50 transition-colors group"
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-apple-gold/10 rounded-full blur-xl pointer-events-none group-hover:bg-apple-gold/20 transition-colors"></div>
          <div className="flex items-center gap-2 text-apple-text-muted relative z-10">
            <div className="p-1.5 rounded-lg bg-apple-gold/10 border border-apple-gold/20 group-hover:bg-apple-gold/20 transition-colors">
              <LibraryIcon size={14} className="text-apple-gold" />
            </div>
            <span className="text-xs font-medium tracking-widest">收集进度</span>
          </div>
          <div className="text-3xl font-sans font-bold text-apple-text relative z-10 drop-shadow-md">{fragments.length} <span className="text-lg text-apple-text-muted/50">/ 8</span></div>
        </motion.div>
      </div>

      {/* Profiles Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans font-bold text-lg text-apple-text flex items-center gap-2">
            <Compass size={18} className="text-apple-gold" />
            命理档案
          </h3>
          <button 
            onClick={() => navigate('/app/bazi')}
            className="text-xs font-medium text-apple-gold bg-apple-gold/10 px-3 py-1.5 rounded-full hover:bg-apple-gold/20 transition-colors border border-apple-gold/30"
          >
            + 新建档案
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {profiles.length === 0 ? (
            <div className="w-full bg-apple-surface backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-apple-border border-dashed shadow-inner">
              <Compass size={32} className="text-apple-text-muted/20 mb-3" />
              <p className="text-sm text-apple-text-muted mb-4">还没有添加任何命理档案</p>
              <button 
                onClick={() => navigate('/app/bazi')}
                className="text-sm font-medium text-black bg-gradient-to-r from-apple-gold to-[#B8860B] px-5 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.5)] transition-all"
              >
                去添加
              </button>
            </div>
          ) : (
            profiles.map(profile => (
              <div 
                key={profile.id}
                onClick={() => setActiveProfileId(profile.id)}
                className={clsx(
                  "min-w-[160px] bg-apple-surface backdrop-blur-xl rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group",
                  activeProfileId === profile.id 
                    ? "border-apple-gold shadow-[0_4px_20px_rgba(212,175,55,0.2)]" 
                    : "border-apple-border hover:border-apple-border shadow-md"
                )}
              >
                {activeProfileId === profile.id && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-apple-gold/20 to-transparent rounded-bl-full pointer-events-none"></div>
                )}
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A2A35] to-[#141419] flex items-center justify-center text-lg shadow-inner border border-apple-border group-hover:border-apple-border transition-colors">
                    {profile.gender === 'male' ? '👨' : '👩'}
                  </div>
                  {activeProfileId === profile.id && (
                    <div className="bg-apple-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">当前</div>
                  )}
                </div>
                <h4 className="font-bold text-apple-text mb-1 truncate relative z-10">{profile.name}</h4>
                <p className="text-xs text-apple-text-muted font-mono relative z-10">{profile.birthDate}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`确定要删除 ${profile.name} 的档案吗？`)) {
                      setProfiles(prev => prev.filter(p => p.id !== profile.id));
                      if (activeProfileId === profile.id) {
                        setActiveProfileId(null);
                      }
                    }
                  }}
                  className="absolute bottom-4 right-4 p-1.5 rounded-full bg-apple-surface text-apple-text-muted hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Bond Level Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-apple-surface backdrop-blur-xl rounded-3xl p-6 mb-8 border border-apple-border shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6B8AFF]/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6B8AFF]/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#6B8AFF]/10 border border-[#6B8AFF]/20">
                <Heart size={16} className="text-[#6B8AFF]" />
              </div>
              <span className="font-sans font-semibold text-lg tracking-widest text-apple-text">羁绊等级</span>
            </div>
            <span className="text-[#6B8AFF] font-bold font-mono bg-[#6B8AFF]/10 px-3 py-1 rounded-full border border-[#6B8AFF]/20 shadow-[0_0_10px_rgba(107,138,255,0.2)]">LV.{bondLevel}</span>
          </div>
          
          <div className="text-center mb-6">
            <span className="text-2xl font-sans font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#6B8AFF] to-[#4F46E5] drop-shadow-sm">
              {LEVEL_TITLES[bondLevel - 1]}
            </span>
          </div>

          <div className="w-full h-2.5 bg-apple-surface rounded-full overflow-hidden mb-3 border border-apple-border shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#6B8AFF]/80 to-[#6B8AFF] shadow-[0_0_10px_rgba(107,138,255,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-apple-text-muted font-mono">
            <span>{bondExp} EXP</span>
            <span>{nextLevelExp} EXP</span>
          </div>
        </div>
      </motion.div>

      {/* Settings List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-apple-surface backdrop-blur-xl rounded-3xl overflow-hidden border border-apple-border shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
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
        <SettingItem title="关于星轨" hasBorder={false} onClick={() => navigate('/app/about')} />
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
    <div className="flex items-center justify-between p-5 bg-apple-surface hover:bg-apple-surface-hover transition-colors border-b border-apple-border">
      <div className="flex items-center gap-3 text-apple-text">
        {icon}
        <span className="font-medium tracking-wide text-sm">{title}</span>
      </div>
      <button 
        onClick={onChange}
        className={clsx(
          "w-12 h-6 rounded-full transition-colors relative",
          checked ? "bg-[#6B8AFF]" : "bg-apple-surface-hover"
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
      className={`flex items-center justify-between p-5 bg-apple-surface hover:bg-apple-surface-hover transition-colors cursor-pointer ${hasBorder ? 'border-b border-apple-border' : ''}`}
    >
      <span className="font-medium tracking-wide text-sm text-apple-text">{title}</span>
      <ChevronRight size={18} className="text-apple-text-muted" />
    </div>
  );
}
