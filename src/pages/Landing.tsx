import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Book, Shield, ArrowRight, Star, ChevronDown, Activity } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Ensure scroll is at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const sections = ['首屏', '核心功能', '开启旅程'];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#05050A] text-apple-text font-sans selection:bg-apple-accent selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#F5F5F7]/80 dark:bg-[#05050A]/80 backdrop-blur-xl border-b border-apple-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-apple-text flex items-center justify-center text-apple-bg">
            <Compass size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">星轨 AstroRail</span>
        </div>
        <button 
          onClick={() => navigate('/app')}
          className="px-5 py-2 bg-apple-text text-apple-bg rounded-full text-sm font-bold hover:scale-105 transition-transform"
        >
          进入应用
        </button>
      </nav>

      {/* Right side dot navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
        {sections.map((label, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className="group relative flex items-center justify-end w-8 h-8"
          >
            <span className={`absolute right-10 text-xs font-medium px-2 py-1 rounded bg-apple-surface border border-apple-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md ${activeSection === idx ? 'text-apple-text' : 'text-apple-text-muted'}`}>
              {label}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSection === idx ? 'bg-apple-text scale-150' : 'bg-apple-text-muted/40 hover:bg-apple-text-muted/80'}`} />
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section ref={(el) => (sectionRefs.current[0] = el)} className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
          
          {/* Left: Typography */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-surface border border-apple-border mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-apple-accent" />
              <span className="text-xs font-bold tracking-widest uppercase">AI 驱动的命运探索</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
              洞悉未知<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-apple-accent to-purple-500">
                重塑命运
              </span><br />
              探索星轨
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-apple-text-muted max-w-md mb-10 leading-relaxed font-medium">
              结合前沿人工智能与传统命理学，为你揭示命运的无尽可能，开启一段探索自我与未来的奇妙旅程。
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-apple-text text-apple-bg rounded-full font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl"
              >
                立即开启
                <ArrowRight size={20} />
              </button>
              <button onClick={() => scrollToSection(1)} className="w-14 h-14 rounded-full border border-apple-border flex items-center justify-center hover:bg-apple-surface transition-colors group md:hidden">
                <ChevronDown className="text-apple-text group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right: 3D Image Placeholder & Glass Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-[3rem] bg-gradient-to-br from-apple-accent/10 to-purple-500/10 border border-apple-border flex items-center justify-center overflow-hidden group"
          >
            {/* Placeholder for user's 3D image */}
            <img 
              src="/details.png" 
              alt="3D Abstract" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-normal group-hover:scale-105 transition-transform duration-1000"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Fallback abstract shapes if image is missing */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
               <div className="w-64 h-64 bg-apple-accent/30 rounded-full blur-3xl absolute"></div>
               <div className="w-64 h-64 bg-purple-500/30 rounded-full blur-3xl absolute translate-x-20 translate-y-20"></div>
            </div>

            {/* Glassmorphic Floating Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 p-6 rounded-3xl bg-apple-surface/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-apple-accent/20 flex items-center justify-center">
                  <Activity className="text-apple-accent" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">星轨引擎已就绪</span>
                  <span className="text-xs text-apple-text-muted">AI 命理大模型</span>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse hidden sm:block shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </motion.div>
          </motion.div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer md:hidden"
          onClick={() => scrollToSection(1)}
        >
          <span className="text-xs font-bold tracking-widest text-apple-text-muted uppercase">向下滚动</span>
          <div className="w-6 h-10 rounded-full border-2 border-apple-text-muted flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-apple-text-muted"
            />
          </div>
        </motion.div>
      </section>

      {/* Bento Box Features Section */}
      <section ref={(el) => (sectionRefs.current[1] = el)} className="py-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            重塑你的命运轨迹<br/>
            <span className="inline-block px-6 py-2 mt-2 bg-apple-text text-apple-bg rounded-full text-2xl md:text-4xl align-middle">独具匠心</span>
          </h2>
          <p className="text-apple-text-muted max-w-xl text-lg font-medium">探索古老智慧与现代科技的完美融合，体验我们为您精心打造的专属命运探索工具。</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: Bazi (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            onClick={() => navigate('/app/bazi')}
            className="md:col-span-2 lg:col-span-2 md:row-span-2 rounded-[2.5rem] bg-[#E5F0E5] dark:bg-[#1A2E1A] p-8 md:p-12 relative overflow-hidden group min-h-[400px] md:min-h-[600px] flex flex-col cursor-pointer"
          >
            {/* Micro-illustration: Star Chart */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[120%] h-[120%] opacity-10 dark:opacity-20 pointer-events-none flex items-center justify-center">
              <div className="absolute w-[80%] h-[80%] rounded-full border-[1px] border-dashed border-[#1A3A1A] dark:border-[#88D488] animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full border-[1px] border-[#1A3A1A] dark:border-[#88D488] animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute w-[40%] h-[40%] rounded-full border-[2px] border-dotted border-[#1A3A1A] dark:border-[#88D488] animate-[spin_20s_linear_infinite]"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
                  <Compass className="w-7 h-7 text-[#2C5E2C] dark:text-[#88D488]" />
                </div>
                <span className="px-4 py-1.5 bg-white/40 dark:bg-black/40 rounded-full text-xs font-bold text-[#2C5E2C] dark:text-[#88D488] backdrop-blur-md">全新上线</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-[#1A3A1A] dark:text-[#E5F0E5] mb-4 tracking-tight leading-tight">八字排盘<br/>Bazi Destiny</h3>
              <p className="text-[#2C5E2C]/80 dark:text-[#88D488]/80 text-lg max-w-sm mb-8">精准推演命理星轨，洞悉人生起伏与每日运势。结合传统智慧与现代算法。</p>
              
              <div className="mt-auto flex items-center justify-end">
                <div className="w-12 h-12 rounded-full bg-[#1A3A1A]/10 dark:bg-[#88D488]/10 flex items-center justify-center group-hover:bg-[#1A3A1A] dark:group-hover:bg-[#88D488] transition-colors duration-300">
                  <ArrowRight className="text-[#1A3A1A] dark:text-[#88D488] group-hover:text-white dark:group-hover:text-[#1A2E1A] transition-colors duration-300" />
                </div>
              </div>
            </div>
            {/* Image Placeholder */}
            <img src="/image-280.png" alt="Bazi" className="absolute bottom-6 right-6 w-1/2 md:w-2/5 object-contain opacity-90 group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl" onError={(e) => e.currentTarget.style.display = 'none'} />
          </motion.div>

          {/* Feature 2: Tarot */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onClick={() => navigate('/app')}
            className="md:col-span-1 lg:col-span-2 rounded-[2.5rem] bg-[#F0E5F0] dark:bg-[#2E1A2E] p-8 relative overflow-hidden group min-h-[280px] cursor-pointer"
          >
            {/* Micro-illustration: Tarot Card */}
            <div className="absolute -bottom-10 -right-10 w-48 h-64 bg-gradient-to-br from-[#5E2C5E]/10 to-[#D488D4]/10 dark:from-[#D488D4]/10 dark:to-[#5E2C5E]/10 rounded-xl border border-[#5E2C5E]/20 dark:border-[#D488D4]/20 transform rotate-12 group-hover:rotate-6 transition-transform duration-500 flex items-center justify-center">
               <div className="w-[80%] h-[90%] border border-[#5E2C5E]/20 dark:border-[#D488D4]/20 rounded-lg"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
                  <Star className="w-7 h-7 text-[#5E2C5E] dark:text-[#D488D4]" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#3A1A3A] dark:text-[#F0E5F0] mb-3">塔罗占卜 Tarot</h3>
              <p className="text-[#5E2C5E]/80 dark:text-[#D488D4]/80 text-base max-w-xs mb-6">倾听潜意识的声音，揭示当下的迷惘与未来的指引。</p>
              
              <div className="w-10 h-10 rounded-full bg-[#5E2C5E]/10 dark:bg-[#D488D4]/10 flex items-center justify-center group-hover:bg-[#5E2C5E] dark:group-hover:bg-[#D488D4] transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-[#5E2C5E] dark:text-[#D488D4] group-hover:text-white dark:group-hover:text-[#2E1A2E] transition-colors duration-300" />
              </div>
            </div>
            <img src="/Image 279.png" alt="Tarot" className="absolute -top-4 right-2 w-[55%] object-contain opacity-90 group-hover:translate-x-2 transition-transform duration-700 drop-shadow-2xl" onError={(e) => e.currentTarget.style.display = 'none'} />
          </motion.div>

          {/* Feature 3: Simulator */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onClick={() => navigate('/app/simulator')}
            className="md:col-span-1 lg:col-span-1 rounded-[2.5rem] bg-[#E5EEF0] dark:bg-[#1A282E] p-8 relative overflow-hidden group min-h-[280px] cursor-pointer"
          >
            {/* Micro-illustration: Nodes */}
            <div className="absolute top-10 right-10 w-24 h-24 opacity-20 dark:opacity-30 pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-[#2C4A5E] dark:bg-[#88BCD4] animate-ping"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#2C4A5E] dark:bg-[#88BCD4] animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#2C4A5E] dark:bg-[#88BCD4]"></div>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <line x1="10" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" className="text-[#2C4A5E] dark:text-[#88BCD4]" />
                <line x1="50" y1="50" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-[#2C4A5E] dark:text-[#88BCD4]" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
                <Sparkles className="w-7 h-7 text-[#2C4A5E] dark:text-[#88BCD4]" />
              </div>
              <h3 className="text-2xl font-black text-[#1A2E3A] dark:text-[#E5EEF0] mb-3">人生模拟器</h3>
              <p className="text-[#2C4A5E]/80 dark:text-[#88BCD4]/80 text-sm mb-6">在平行宇宙中体验不同的因果线与人生抉择。</p>
              
              <div className="w-10 h-10 rounded-full bg-[#2C4A5E]/10 dark:bg-[#88BCD4]/10 flex items-center justify-center group-hover:bg-[#2C4A5E] dark:group-hover:bg-[#88BCD4] transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-[#2C4A5E] dark:text-[#88BCD4] group-hover:text-white dark:group-hover:text-[#1A282E] transition-colors duration-300" />
              </div>
            </div>
            <img src="/Image 278 (1).png" alt="Simulator" className="absolute bottom-4 right-4 w-[55%] object-contain opacity-90 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" onError={(e) => e.currentTarget.style.display = 'none'} />
          </motion.div>

          {/* Feature 4: Guardian */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={() => navigate('/app/guardian')}
            className="md:col-span-1 lg:col-span-1 rounded-[2.5rem] bg-[#F0EAE5] dark:bg-[#2E241A] p-8 relative overflow-hidden group min-h-[280px] cursor-pointer"
          >
            {/* Micro-illustration: Shield Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-[#5E452C]/10 to-transparent dark:from-[#D4B088]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
                <Shield className="w-7 h-7 text-[#5E452C] dark:text-[#D4B088]" />
              </div>
              <h3 className="text-2xl font-black text-[#3A281A] dark:text-[#F0EAE5] mb-3">星轨守护</h3>
              <p className="text-[#5E452C]/80 dark:text-[#D4B088]/80 text-sm mb-6">你的专属AI守护灵，倾听心声，提供情感支持。</p>
              
              <div className="w-10 h-10 rounded-full bg-[#5E452C]/10 dark:bg-[#D4B088]/10 flex items-center justify-center group-hover:bg-[#5E452C] dark:group-hover:bg-[#D4B088] transition-colors duration-300">
                <ArrowRight className="w-5 h-5 text-[#5E452C] dark:text-[#D4B088] group-hover:text-white dark:group-hover:text-[#2E241A] transition-colors duration-300" />
              </div>
            </div>
            <img src="/Image 277 (1).png" alt="Guardian" className="absolute bottom-8 right-4 w-[55%] object-contain opacity-90 group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" onError={(e) => e.currentTarget.style.display = 'none'} />
          </motion.div>

          {/* Feature 5: Diary */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onClick={() => navigate('/app/diary')}
            className="md:col-span-full lg:col-span-4 rounded-[2.5rem] bg-apple-surface border border-apple-border p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[300px] cursor-pointer group"
          >
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-black/40 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
                <Book className="w-7 h-7 text-apple-text" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-apple-text mb-4">命运日记 Diary</h3>
              <p className="text-apple-text-muted text-lg max-w-md mb-8">记录每日心情与感悟，AI自动生成命理运势分析，见证你的成长轨迹。</p>
              
              <div className="w-12 h-12 rounded-full bg-apple-text/5 flex items-center justify-center group-hover:bg-apple-text transition-colors duration-300">
                <ArrowRight className="w-6 h-6 text-apple-text group-hover:text-apple-bg transition-colors duration-300" />
              </div>
            </div>
            <div className="flex-1 w-full h-full min-h-[200px] flex items-center justify-center relative">
               <img src="/feature-diary.png" alt="Diary" className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80 z-20" onError={(e) => e.currentTarget.style.display = 'none'} />
               
               {/* Abstract Data Visualization Placeholder */}
               <div className="w-full h-full bg-gradient-to-br from-apple-surface to-apple-bg rounded-2xl border border-apple-border/50 flex flex-col items-center justify-center p-6 relative overflow-hidden z-10 shadow-inner">
                  <div className="flex items-end gap-3 h-32 w-full justify-center mb-6 opacity-70">
                    <motion.div animate={{ height: ['40%', '60%', '40%'] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-8 bg-apple-accent/40 rounded-t-lg"></motion.div>
                    <motion.div animate={{ height: ['70%', '50%', '70%'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-8 bg-apple-accent/60 rounded-t-lg"></motion.div>
                    <motion.div animate={{ height: ['50%', '80%', '50%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="w-8 bg-purple-500/50 rounded-t-lg"></motion.div>
                    <motion.div animate={{ height: ['90%', '60%', '90%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="w-8 bg-apple-gold/50 rounded-t-lg"></motion.div>
                    <motion.div animate={{ height: ['60%', '40%', '60%'] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="w-8 bg-emerald-500/50 rounded-t-lg"></motion.div>
                  </div>
                  <span className="text-apple-text-muted font-mono text-sm font-bold tracking-widest uppercase relative z-10 bg-apple-surface/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-apple-border">运势波动分析</span>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer CTA */}
      <section ref={(el) => (sectionRefs.current[2] = el)} className="py-24 px-6 text-center min-h-[60vh] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-apple-text text-apple-bg rounded-[3rem] p-12 md:p-24 relative overflow-hidden w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight relative z-10">准备好探索了吗？</h2>
          <p className="text-apple-bg/70 text-xl mb-12 relative z-10 max-w-lg mx-auto font-medium">开启你的星轨之旅，探索命运的无限可能。</p>
          <button 
            onClick={() => navigate('/app')}
            className="px-12 py-6 bg-apple-bg text-apple-text rounded-full font-black text-xl hover:scale-105 transition-transform relative z-10 shadow-2xl"
          >
            立即开启旅程
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
