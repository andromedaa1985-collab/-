import React, { useState } from 'react';
import { useAppContext, FRAGMENTS_POOL } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function Collection() {
  const { fragments, setFragments, setEnergy, setBondExp } = useAppContext();
  const [selectedFragment, setSelectedFragment] = useState<any>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [useMessage, setUseMessage] = useState<string | null>(null);

  const handleUseFragment = (fragment: any) => {
    // Remove one instance of the fragment
    const index = fragments.findIndex(f => f.id === fragment.id);
    if (index !== -1) {
      const newFragments = [...fragments];
      newFragments.splice(index, 1);
      setFragments(newFragments);
      
      let effectMsg = '';
      if (fragment.rarity === 'N') {
        setEnergy(prev => prev + 1);
        effectMsg = `已消耗【${fragment.name}】，能量 +1`;
      } else if (fragment.rarity === 'R') {
        setEnergy(prev => prev + 3);
        setBondExp(prev => prev + 10);
        effectMsg = `已消耗【${fragment.name}】，能量 +3，羁绊 +10`;
      } else if (fragment.rarity === 'SR') {
        setEnergy(prev => prev + 10);
        setBondExp(prev => prev + 50);
        effectMsg = `已消耗【${fragment.name}】，能量 +10，羁绊 +50`;
      } else if (fragment.rarity === 'SSR') {
        setEnergy(prev => prev + 50);
        setBondExp(prev => prev + 200);
        effectMsg = `已消耗【${fragment.name}】！星轨共鸣！能量 +50，羁绊 +200！`;
      }

      setUseMessage(effectMsg);
      setTimeout(() => {
        setUseMessage(null);
        setSelectedFragment(null);
      }, 2000);
    }
  };

  const getButtonText = (rarity: string) => {
    switch (rarity) {
      case 'N': return '使用碎片 (恢复 1 点能量)';
      case 'R': return '使用碎片 (恢复 3 能量, +10 羁绊)';
      case 'SR': return '使用碎片 (恢复 10 能量, +50 羁绊)';
      case 'SSR': return '唤醒神器 (恢复 50 能量, +200 羁绊)';
      default: return '使用碎片';
    }
  };

  // Group fragments by rarity
  const grouped = FRAGMENTS_POOL.reduce((acc, f) => {
    if (!acc[f.rarity]) acc[f.rarity] = [];
    acc[f.rarity].push(f);
    return acc;
  }, {} as Record<string, typeof FRAGMENTS_POOL>);

  const rarities = ['SSR', 'SR', 'R', 'N'];
  const isComplete = fragments.length === FRAGMENTS_POOL.length;

  return (
    <div className="min-h-full w-full px-6 pt-12 pb-32 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#007AFF]/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-32 h-32 border border-[#007AFF]/10 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 border border-[#007AFF]/10 rounded-full rotate-45"></div>
      </div>
      <div className="absolute top-20 left-10 w-16 h-16 border border-[#007AFF]/10 rotate-45 pointer-events-none"></div>

      <div className="flex flex-col items-center mb-10 relative z-10">
        <h1 className="font-serif text-3xl font-bold tracking-widest text-[#007AFF] mb-2">
          记忆图鉴
        </h1>
        <p className="text-[#8E8E93] text-sm tracking-widest">收集命运的碎片，拼凑完整的星轨</p>
        
        <div className="mt-6 px-4 py-2 glass-pill text-sm text-[#1D1D1F] flex items-center gap-4">
          <span>收集进度: <span className="text-[#007AFF] font-bold">{fragments.length}</span> / {FRAGMENTS_POOL.length}</span>
          {isComplete && (
            <button 
              onClick={() => setShowGallery(true)}
              className="flex items-center gap-1 text-[#007AFF] hover:text-[#0056b3] transition-colors"
            >
              <Sparkles size={14} /> 唤醒画廊
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {rarities.map(rarity => {
          const items = grouped[rarity];
          if (!items) return null;
          
          return (
            <div key={rarity} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-black/10"></div>
                <span className={`font-serif text-lg font-bold tracking-widest rarity-${rarity}`}>{rarity}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-black/10"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {items.map(f => {
                  const hasIt = fragments.find(p => p.id === f.id);
                  return (
                    <motion.div 
                      key={f.id} 
                      layoutId={`fragment-card-${f.id}`}
                      whileTap={hasIt ? { scale: 0.95 } : {}}
                      onClick={() => hasIt && setSelectedFragment(f)}
                      className={`group relative aspect-[2/3] rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-500 overflow-hidden ${
                        !hasIt ? 'bg-gradient-to-br from-[#F2F2F7] to-[#E5E5EA] border border-[#D1D1D6] shadow-inner' : 
                        rarity === 'SSR' ? 'cursor-pointer bg-gradient-to-br from-[#FFFBE6] to-[#FFF1B8] border border-[#FFD700]/50 shadow-[0_8px_20px_rgba(255,215,0,0.2)] hover:shadow-[0_12px_30px_rgba(255,215,0,0.4)] hover:-translate-y-2' :
                        rarity === 'SR' ? 'cursor-pointer bg-gradient-to-br from-[#F9F0FF] to-[#EED2FF] border border-[#9D00FF]/40 shadow-[0_8px_20px_rgba(157,0,255,0.15)] hover:shadow-[0_12px_30px_rgba(157,0,255,0.3)] hover:-translate-y-2' :
                        rarity === 'R' ? 'cursor-pointer bg-gradient-to-br from-[#F0F7FF] to-[#D6E8FF] border border-[#007AFF]/30 shadow-[0_4px_15px_rgba(0,122,255,0.1)] hover:shadow-[0_12px_25px_rgba(0,122,255,0.2)] hover:-translate-y-2' :
                        'cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#007AFF]/30 hover:-translate-y-2'
                      }`}
                    >
                      {/* Inner decorative border for unlocked cards */}
                      {hasIt && (
                        <div className={`absolute inset-1.5 border border-dashed rounded-xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-70 ${
                          rarity === 'SSR' ? 'border-[#B8860B]' :
                          rarity === 'SR' ? 'border-[#8A2BE2]' :
                          rarity === 'R' ? 'border-[#0056b3]' :
                          'border-gray-400'
                        }`}></div>
                      )}

                      {/* Locked State Card Back Pattern */}
                      {!hasIt && (
                        <div className="absolute inset-1.5 border border-[#C7C7CC] rounded-xl pointer-events-none flex items-center justify-center opacity-50">
                          <div className="w-full h-full border border-[#C7C7CC] m-1 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 border border-[#C7C7CC] rotate-45"></div>
                          </div>
                        </div>
                      )}

                      {/* Existing effects for SSR/SR */}
                      {hasIt && rarity === 'SSR' && (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.4),transparent_60%)] animate-gold-shine pointer-events-none"></div>
                          <Sparkles className="absolute top-3 right-3 text-[#FFD700] animate-ping opacity-70 pointer-events-none" size={14} />
                          <Sparkles className="absolute bottom-3 left-3 text-[#FFD700] animate-pulse opacity-70 pointer-events-none" size={18} />
                        </>
                      )}
                      {hasIt && rarity === 'SR' && (
                        <>
                          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[#9D00FF]/20 to-transparent animate-shimmer pointer-events-none"></div>
                        </>
                      )}

                      {/* Content */}
                      <div className="flex-1 flex items-center justify-center relative z-10 w-full">
                        {hasIt ? (
                          <motion.div layoutId={`fragment-icon-${f.id}`} className="text-5xl sm:text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                            {f.icon}
                          </motion.div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#8E8E93] shadow-inner">
                            <Sparkles size={20} />
                          </div>
                        )}
                      </div>

                      <div className="w-full mt-auto pt-3 border-t border-black/5 relative z-10 bg-white/30 backdrop-blur-sm -mx-4 px-4 -mb-4 pb-4">
                        <motion.div layoutId={`fragment-name-${f.id}`} className={`text-xs font-bold text-center tracking-widest ${
                          hasIt ? 
                            rarity === 'SSR' ? 'text-[#B8860B]' :
                            rarity === 'SR' ? 'text-[#8A2BE2]' :
                            rarity === 'R' ? 'text-[#0056b3]' :
                            'text-[#1D1D1F]'
                          : 'text-[#8E8E93]'
                        }`}>
                          {hasIt ? f.name : '未知记忆'}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedFragment && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => { setSelectedFragment(null); setUseMessage(null); }}
          >
            <motion.div 
              layoutId={`fragment-card-${selectedFragment.id}`}
              className={`w-full max-w-sm glass-panel p-8 flex flex-col items-center text-center relative shadow-2xl overflow-hidden ${
                selectedFragment.rarity === 'SSR' ? 'border-[#FFD700]/50 shadow-[0_10px_40px_rgba(255,215,0,0.2)]' :
                selectedFragment.rarity === 'SR' ? 'border-[#9D00FF]/40 shadow-[0_10px_30px_rgba(157,0,255,0.15)]' :
                'border-black/5'
              }`}
              onClick={e => e.stopPropagation()}
            >
              {selectedFragment.rarity === 'SSR' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.3),transparent_50%)] animate-gold-shine pointer-events-none"></div>
                  <Sparkles className="absolute top-4 right-12 text-[#FFD700] animate-ping opacity-70 pointer-events-none" size={16} />
                  <Sparkles className="absolute bottom-12 left-6 text-[#FFD700] animate-pulse opacity-70 pointer-events-none" size={24} />
                </>
              )}
              {selectedFragment.rarity === 'SR' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#9D00FF]/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[#9D00FF]/10 to-transparent animate-shimmer pointer-events-none"></div>
                </>
              )}
              
              <button onClick={() => { setSelectedFragment(null); setUseMessage(null); }} className="absolute top-4 right-4 text-black/40 hover:text-[#1D1D1F] z-10"><X size={20}/></button>
              
              <motion.div layoutId={`fragment-icon-${selectedFragment.id}`} className="text-7xl mb-6 drop-shadow-md relative z-10">{selectedFragment.icon}</motion.div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span className={`text-sm font-bold px-2 py-0.5 rounded border rarity-${selectedFragment.rarity} border-current`}>
                  {selectedFragment.rarity}
                </span>
                <motion.h3 layoutId={`fragment-name-${selectedFragment.id}`} className="font-serif text-2xl text-[#1D1D1F]">{selectedFragment.name}</motion.h3>
              </div>
              
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#007AFF]/50 to-transparent my-4 relative z-10"></div>
              
              <p className="text-[#8E8E93] text-sm leading-relaxed tracking-wide mb-6 relative z-10">
                {selectedFragment.desc}
              </p>

              <div className="relative z-10 w-full">
                {useMessage ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`font-medium text-sm px-4 py-3 rounded-xl ${
                      selectedFragment.rarity === 'SSR' ? 'bg-[#FFD700]/20 text-[#B8860B]' :
                      selectedFragment.rarity === 'SR' ? 'bg-[#9D00FF]/10 text-[#8A2BE2]' :
                      'bg-[#007AFF]/10 text-[#007AFF]'
                    }`}
                  >
                    {useMessage}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => handleUseFragment(selectedFragment)}
                    className={`w-full py-3 rounded-xl text-white font-medium shadow-md transition-colors active:scale-95 ${
                      selectedFragment.rarity === 'SSR' ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#E69500] shadow-[0_4px_15px_rgba(255,215,0,0.4)]' :
                      selectedFragment.rarity === 'SR' ? 'bg-gradient-to-r from-[#9D00FF] to-[#C71585] hover:from-[#8A00E6] hover:to-[#B31277] shadow-[0_4px_15px_rgba(157,0,255,0.3)]' :
                      'bg-[#007AFF] hover:bg-[#0056b3]'
                    }`}
                  >
                    {getButtonText(selectedFragment.rarity)}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            <button onClick={() => setShowGallery(false)} className="absolute top-6 right-6 text-black/40 hover:text-[#1D1D1F] z-50"><X size={24}/></button>
            <h2 className="font-serif text-2xl text-[#007AFF] mb-8 tracking-widest">星轨画廊</h2>
            <div className="w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-black/5 relative">
              <img 
                src="https://image.pollinations.ai/prompt/anime-girl-white-hair-tarot-card-goddess?width=800&height=1200&nologo=true" 
                alt="Gallery" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent">
                <h3 className="font-serif text-xl text-[#1D1D1F] mb-2">命运的终点</h3>
                <p className="text-[#8E8E93] text-sm leading-relaxed">
                  你已经收集了所有的记忆碎片。星轨的引路人为你揭示了最终的画面。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
