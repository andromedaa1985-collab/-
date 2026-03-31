import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import clsx from 'clsx';

export default function Privacy() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ analytics: true, ads: false, publicProfile: false });

  const toggle = (key: keyof typeof settings) => setSettings(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-full w-full px-6 pt-12 pb-32 relative">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#1D1D1F]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-2xl font-bold tracking-widest text-[#1D1D1F] ml-2">隐私设置</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl overflow-hidden border-black/5 shadow-sm">
        <ToggleRow title="允许收集使用数据" desc="帮助我们改进星轨塔罗的体验" checked={settings.analytics} onChange={() => toggle('analytics')} />
        <ToggleRow title="个性化广告" desc="根据您的占卜偏好推荐内容" checked={settings.ads} onChange={() => toggle('ads')} />
        <ToggleRow title="公开占卜记录" desc="允许其他旅人查看您的星轨" checked={settings.publicProfile} onChange={() => toggle('publicProfile')} hasBorder={false} />
      </motion.div>
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange, hasBorder = true }: any) {
  return (
    <div className={`flex items-center justify-between p-5 bg-black/5 hover:bg-black/10 transition-colors ${hasBorder ? 'border-b border-black/5' : ''}`}>
      <div className="flex flex-col gap-1 pr-4">
        <span className="font-medium tracking-wide text-sm text-[#1D1D1F]">{title}</span>
        <span className="text-xs text-[#8E8E93] leading-relaxed">{desc}</span>
      </div>
      <button onClick={onChange} className={clsx("w-12 h-6 rounded-full transition-colors relative shrink-0", checked ? "bg-[#34C759]" : "bg-black/10")}>
        <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" animate={{ left: checked ? "calc(100% - 22px)" : "2px" }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
      </button>
    </div>
  );
}
