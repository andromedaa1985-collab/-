import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  { q: "如何获得占卜能量？", a: "能量会随着时间自然恢复，每小时恢复1点。您也可以通过提升与星轨少女的羁绊等级来获得额外的能量上限和一次性恢复。" },
  { q: "羁绊等级有什么用？", a: "羁绊等级代表您与星轨少女的连接深度。等级提升可以解锁新的语音、专属塔罗牌背以及特殊的占卜仪式。" },
  { q: "图鉴里的碎片怎么收集？", a: "每次进行深度占卜（消耗能量的占卜）时，都有概率掉落记忆碎片。集齐特定组合的碎片可以解锁星轨少女的隐藏剧情。" },
  { q: "占卜结果准确吗？", a: "塔罗牌是一种反映潜意识和能量流动的工具。星轨少女会根据牌面为您提供指引，但最终的决定权始终在您自己手中。" }
];

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full w-full px-6 pt-12 pb-32 relative">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#1D1D1F]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-serif text-2xl font-bold tracking-widest text-[#1D1D1F] ml-2">帮助中心</h1>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-[#8E8E93] tracking-widest ml-2 mb-2">常见问题 (FAQ)</h2>
        {FAQS.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}

        <div className="mt-8 glass-panel rounded-3xl p-6 text-center border-black/5 shadow-sm">
          <h3 className="font-serif font-bold text-[#1D1D1F] mb-2">需要更多帮助？</h3>
          <p className="text-xs text-[#8E8E93] mb-4">如果您遇到了其他问题，或者有任何建议，欢迎随时联系我们。</p>
          <button className="px-6 py-2 bg-[#007AFF] text-white rounded-full text-sm font-medium hover:bg-[#0056b3] transition-colors shadow-md">
            联系客服
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border-black/5 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-black/5 transition-colors"
      >
        <span className="font-medium text-[#1D1D1F] text-sm">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-[#8E8E93]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/5"
          >
            <div className="p-5 pt-0 text-sm text-[#8E8E93] leading-relaxed border-t border-black/5 mt-2 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
