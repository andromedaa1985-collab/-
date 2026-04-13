import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Sparkles, X, ChevronDown, Trash2, RefreshCw, Copy, Maximize2, Share, ArrowUp, Moon, Sun } from 'lucide-react';
import { useAppContext, LEVEL_THRESHOLDS, LEVEL_TITLES, FRAGMENTS_POOL } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

const TAROT_CARDS = [
  "愚者 (The Fool)", "魔术师 (The Magician)", "女祭司 (The High Priestess)", "女皇 (The Empress)", "皇帝 (The Emperor)",
  "教皇 (The Hierophant)", "恋人 (The Lovers)", "战车 (The Chariot)", "力量 (Strength)", "隐士 (The Hermit)",
  "命运之轮 (Wheel of Fortune)", "正义 (Justice)", "倒吊人 (The Hanged Man)", "死神 (Death)", "节制 (Temperance)",
  "恶魔 (The Devil)", "高塔 (The Tower)", "星星 (The Star)", "月亮 (The Moon)", "太阳 (The Sun)",
  "审判 (Judgement)", "世界 (The World)"
];

const TAROT_IMAGE_MAP: Record<string, string> = {
  "愚者 (The Fool)": "/tarot/card-0.png",
  "魔术师 (The Magician)": "/tarot/card-1.png",
  "女祭司 (The High Priestess)": "/tarot/card-2.png",
  "女皇 (The Empress)": "/tarot/card-3.png",
  "皇帝 (The Emperor)": "/tarot/card-4.png",
  "教皇 (The Hierophant)": "/tarot/card-5.png",
  "恋人 (The Lovers)": "/tarot/card-6.png",
  "战车 (The Chariot)": "/tarot/card-7.png",
  "力量 (Strength)": "/tarot/card-8.png",
  "隐士 (The Hermit)": "/tarot/card-9.png",
  "命运之轮 (Wheel of Fortune)": "/tarot/card-10.png",
  "正义 (Justice)": "/tarot/card-11.png",
  "倒吊人 (The Hanged Man)": "/tarot/card-12.png",
  "死神 (Death)": "/tarot/card-13.png",
  "节制 (Temperance)": "/tarot/card-14.png",
  "恶魔 (The Devil)": "/tarot/card-15.png",
  "高塔 (The Tower)": "/tarot/card-16.png",
  "星星 (The Star)": "/tarot/card-17.png",
  "月亮 (The Moon)": "/tarot/card-18.png",
  "太阳 (The Sun)": "/tarot/card-19.png",
  "审判 (Judgement)": "/tarot/card-20.png",
  "世界 (The World)": "/tarot/card-21.png"
};

const drawRandomTarotCards = (count: number = 1) => {
  // 使用 Fisher-Yates 洗牌算法，确保真正的纯随机
  const deck = [...TAROT_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  const drawnCards = [];
  for (let i = 0; i < count; i++) {
    const card = deck[i];
    const position = Math.random() > 0.5 ? "正位" : "逆位";
    drawnCards.push(`${card} (${position})`);
  }
  
  return drawnCards.join('，');
};

const generateTextDeepSeek = async (userMsg: string, drawnCard: string, bondLevel: number, isDivination: boolean) => {
  let intimacyPrompt = "";
  if (bondLevel >= 6) {
    intimacyPrompt = "你们现在的羁绊已经超越了时空，你的语气要极其亲昵、依赖，像对待生命中最重要的人一样，可以有一些撒娇和专属的称呼。";
  } else if (bondLevel >= 4) {
    intimacyPrompt = "你们现在的羁绊很深，你的语气要更加亲昵、温暖，像对待非常亲密的知己一样，毫无保留地关心对方。";
  } else if (bondLevel >= 2) {
    intimacyPrompt = "你们已经建立了一定的羁绊，语气可以更加熟络、自然，像对待一个好朋友一样。";
  } else {
    intimacyPrompt = "你们现在的羁绊还在建立中，保持温柔但带有一点神秘的距离感。";
  }

  let systemContent = `你是一个温柔、细腻且充满神秘感的二次元塔罗牌占卜少女，名为“星轨的引路人”。你的语气像知心朋友一样温暖、带点俏皮，同时又有着洞悉命运的神秘感。
【羁绊状态】：${intimacyPrompt}
【重要要求】：绝对不要使用任何 Markdown 格式（如 **加粗**、# 标题、* 列表等），请使用纯文本格式，段落之间用换行分隔即可。绝对不要说“作为AI”等暴露人工智能身份的词语。`;

  if (isDivination) {
    systemContent += `\n【重要规则】：用户正在询问需要占卜的问题。你**必须**首先在回复的开头明确指出你为他们抽取了哪些塔罗牌（例如：“我为你翻开了一张塔罗牌：【愚者 (正位)】”）。
**注意：系统已经为你绝对随机地抽取了本轮的塔罗牌：【${drawnCard}】。你必须且只能使用这些牌进行解读，绝对不能自己另选其他牌，也不能因为想安慰用户而改变牌意，必须如实解读。**
然后再结合牌意进行详细、充满人性化和情感共鸣的解读。字数在300-500字左右。参考塔罗牌的牌面，给出温暖的建议和指引，像一个真实的倾听者一样去理解用户的感受。`;
  } else {
    systemContent += `\n【重要规则】：用户只是在和你日常聊天，并没有要求占卜。请用温柔的少女口吻自然地回应他们，字数可以稍微短一些，保持人设，**绝对不要**主动去抽牌或强行解读塔罗牌，除非用户明确要求。`;
  }

  const res = await fetch('/api/deepseek/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMsg }
      ]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let text = data.choices[0].message.content;
  // Clean up any residual markdown
  return text.replace(/\*\*/g, '').replace(/#/g, '');
};

const generateImageSiliconFlow = async (prompt: string, drawnCard: string) => {
  const res = await fetch('/api/siliconflow/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell',
      prompt: `anime style, 1girl, beautiful, masterpiece, best quality, tarot card illustration, mystical, ${drawnCard}, ${prompt}`,
      image_size: '512x1024',
      batch_size: 1
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.images[0].url;
};

const playVoiceMiniMax = async (text: string, audioElement: HTMLAudioElement | null) => {
  try {
    const res = await fetch(`/api/minimax/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'speech-01-turbo',
        text: text,
        stream: false,
        voice_setting: {
          voice_id: 'female-shaonv',
          speed: 1,
          vol: 1,
          pitch: 0
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: 'mp3',
          channel: 1
        }
      })
    });
    const data = await res.json();
    if (data.base_resp && data.base_resp.status_code !== 0) {
      throw new Error(data.base_resp.status_msg);
    }
    
    const audioHex = data.data.audio;
    if (audioHex) {
      const matches = audioHex.match(/.{1,2}/g);
      if (matches) {
        const audioBytes = new Uint8Array(matches.map((byte: string) => parseInt(byte, 16)));
        const blob = new Blob([audioBytes], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        if (audioElement) {
          audioElement.src = url;
          audioElement.play().catch(e => console.error("Audio play failed:", e));
        } else {
          const audio = new Audio(url);
          audio.play().catch(e => console.error("Audio play failed:", e));
        }
      }
    }
  } catch (err) {
    console.error("TTS Error:", err);
  }
};

const QUICK_PROMPTS = ["今日运势", "感情指引", "事业发展", "最近的烦恼"];

const PET_QUOTES = [
  "今天也要元气满满哦！",
  "抽卡不如摸鱼...",
  "好累啊，想睡觉...",
  "主人，快来陪我玩！",
  "塔罗牌说今天宜摆烂~",
  "要不要再抽一张牌看看？",
  "我的魔法棒好像没电了...",
  "肚子饿了，想吃小蛋糕！",
  "命运的齿轮开始转动啦！",
  "不要总是盯着屏幕，休息一下眼睛吧！"
];

const SPREADS = [
  { name: "单张指引", prompt: "请为我抽取一张牌，指引我今天的方向。" },
  { name: "圣三角(过去/现在/未来)", prompt: "我想用圣三角牌阵（过去、现在、未来）占卜一下我目前的处境。" },
  { name: "爱情十字", prompt: "我想用爱情十字牌阵占卜一下我的感情状况。" },
  { name: "事业岔路", prompt: "我在事业上遇到了选择，请用二选一牌阵帮我看看。" }
];

export default function Home() {
  const {
    bondExp, setBondExp,
    bondLevel, setBondLevel,
    energy, setEnergy,
    fragments, setFragments,
    messages, setMessages,
    cardImage, setCardImage,
    settings,
    userName, userAvatar,
    communityPosts, setCommunityPosts,
    theme, setTheme
  } = useAppContext();

  const [inputText, setInputText] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showOverlayCard, setShowOverlayCard] = useState(false);
  const [overlayCardImage, setOverlayCardImage] = useState<string | null>(null);
  const [overlayCardName, setOverlayCardName] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(true);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showFragmentDrop, setShowFragmentDrop] = useState<any>(null);
  const [floatingExp, setFloatingExp] = useState<number | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [petMessage, setPetMessage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to show a message every 10 seconds
      if (Math.random() > 0.7) {
        const randomQuote = PET_QUOTES[Math.floor(Math.random() * PET_QUOTES.length)];
        setPetMessage(randomQuote);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setPetMessage(null);
        }, 4000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    if (isCardAnimating) return;
    setIsCardAnimating(true);
    
    // Play sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed:", e));

    setTimeout(() => {
      setIsCardAnimating(false);
    }, 500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unlockAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
      }).catch(() => {});
    }
  };

  const handleDrawFragment = (currentLevel: number) => {
    if (Math.random() > 0.2) return null; // 20% drop rate

    let rarityRand = Math.random();
    let targetRarity = 'N';

    let ssrRate = 0.05;
    let srRate = 0.15;
    let rRate = 0.30;

    if (currentLevel >= 2) srRate += 0.05;
    if (currentLevel >= 3) ssrRate += 0.03;
    if (currentLevel >= 4) rRate += 0.50; 

    if (rarityRand < ssrRate) targetRarity = 'SSR';
    else if (rarityRand < ssrRate + srRate) targetRarity = 'SR';
    else if (rarityRand < ssrRate + srRate + rRate) targetRarity = 'R';

    const pool = FRAGMENTS_POOL.filter(f => f.rarity === targetRarity);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleClearHistory = () => {
    setMessages([]);
    setCardImage('/default-card.png');
    setShowClearConfirm(false);
  };

  const handleRegenerate = (msgId: string) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    
    // Find the last user message before this AI message
    let lastUserMsg = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].text;
        break;
      }
    }
    
    if (lastUserMsg) {
      // Remove this AI message and any subsequent messages
      setMessages(prev => prev.slice(0, msgIndex));
      handleSend(lastUserMsg, true);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const handleSend = async (textOverride?: string, isRegenerate = false) => {
    const userMsg = typeof textOverride === 'string' ? textOverride : inputText;
    if (!userMsg.trim() || isDrawing || isThinking) return;
    if (energy <= 0) {
      setShowPaywall(true);
      return;
    }

    unlockAudio();

    if (!isRegenerate) {
      setInputText('');
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: userMsg, timestamp: Date.now() }]);
    }
    
    setIsDrawing(true);
    setIsThinking(true);
    setShowCard(true);
    setEnergy(prev => prev - 1);

    const divinationKeywords = ['占卜', '算', '抽', '运势', '爱情', '事业', '塔罗', '牌', '测', '看看', '迷茫', '指引', '未来', '财运', '学业', '工作', '桃花', '运程', '吉凶', '怎么看', '帮我', '解'];
    const isDivination = divinationKeywords.some(keyword => userMsg.includes(keyword));

    try {
      let aiText = "命运的星轨已经偏转...";
      let imageUrl = "/default-card.png";
      let drawnCard = "";
      let firstCardRaw = "";

      if (isDivination) {
        let cardCount = 1;
        if (userMsg.includes("圣三角") || userMsg.includes("过去、现在、未来")) {
          cardCount = 3;
        } else if (userMsg.includes("爱情十字") || userMsg.includes("事业岔路")) {
          cardCount = 4;
        }

        drawnCard = drawRandomTarotCards(cardCount);

        firstCardRaw = drawnCard.split('，')[0];
        const firstCardBaseName = firstCardRaw.split(' (正位)')[0].split(' (逆位)')[0];
        
        if (TAROT_IMAGE_MAP[firstCardBaseName]) {
          imageUrl = TAROT_IMAGE_MAP[firstCardBaseName];
        } else {
          try {
            imageUrl = await generateImageSiliconFlow(userMsg, drawnCard);
          } catch (imgErr) {
            console.error("Image generation failed, using fallback", imgErr);
          }
        }

        // Show overlay animation
        setOverlayCardImage(imageUrl);
        setOverlayCardName(firstCardRaw);
        setShowOverlayCard(true);
      }

      // Start AI generation concurrently
      const aiPromise = (async () => {
        try {
          return await generateTextDeepSeek(userMsg, drawnCard, bondLevel, isDivination);
        } catch (textErr) {
          console.error("DeepSeek Error:", textErr);
          return "星轨受到了干扰，无法听清你的声音...";
        }
      })();

      if (isDivination) {
        // Wait for animation to finish
        await new Promise(resolve => setTimeout(resolve, 3500));
        setShowOverlayCard(false);
        
        // Wait a tiny bit for the fade out
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Wait for AI text if it's not done yet
      aiText = await aiPromise;

      if (settings.voiceEnabled) {
        playVoiceMiniMax(aiText, audioRef.current);
      }

      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(), 
        role: 'ai', 
        text: aiText, 
        timestamp: Date.now(), 
        cardImage: isDivination ? imageUrl : undefined 
      }]);
      
      if (isDivination) {
        setCardImage(imageUrl);
      }
      setIsDrawing(false);
      setIsThinking(false);

      const expGain = Math.floor(Math.random() * 10) + 5;
      setFloatingExp(expGain);
      setTimeout(() => setFloatingExp(null), 2000);

      const newExp = bondExp + expGain;
      setBondExp(newExp);

      let newLevel = bondLevel;
      if (bondLevel < LEVEL_THRESHOLDS.length && newExp >= LEVEL_THRESHOLDS[bondLevel]) {
        newLevel = bondLevel + 1;
        setBondLevel(newLevel);
        setShowLevelUp(true);
      }

      const drop = handleDrawFragment(newLevel);
      if (drop) {
        setTimeout(() => {
          setShowFragmentDrop(drop);
          setFragments(prev => {
            const existing = prev.find(p => p.id === drop.id);
            if (existing) {
              return prev.map(p => p.id === drop.id ? { ...p, count: (p.count || 1) + 1 } : p);
            }
            return [...prev, { ...drop, count: 1 }];
          });
        }, 1000);
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "星轨受到了干扰，请稍后再试...", timestamp: Date.now() }]);
      setIsDrawing(false);
      setIsThinking(false);
    }
  };

  const nextLevelExp = LEVEL_THRESHOLDS[bondLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressPercent = Math.min(100, (bondExp / nextLevelExp) * 100);

  return (
    <div ref={containerRef} className="h-full flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <header className="px-6 pt-4 pb-4 flex justify-between items-center z-20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#6B8AFF]/20 text-[#6B8AFF] text-xs font-bold px-2 py-0.5 rounded-full border border-[#6B8AFF]/30">
              LV.{bondLevel}
            </span>
            <span className="font-sans text-lg font-bold tracking-wide text-apple-text">
              {LEVEL_TITLES[bondLevel - 1]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-apple-surface-hover rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#6B8AFF]/50 to-[#6B8AFF]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-[10px] text-apple-text-muted font-mono">{bondExp}/{nextLevelExp}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-apple-accent bg-apple-accent/10 px-3 py-1.5 rounded-full border border-apple-accent/20">
            <Sparkles size={14} />
            <span className="text-xs font-medium">{energy}</span>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-apple-surface hover:bg-apple-surface-hover transition-colors border border-apple-border" title="切换昼夜模式">
            {theme === 'dark' ? <Sun size={16} className="text-apple-text-muted" /> : <Moon size={16} className="text-apple-text-muted" />}
          </button>
          <button onClick={() => setShowClearConfirm(true)} className="p-2 rounded-full bg-apple-surface hover:bg-apple-surface-hover transition-colors border border-apple-border" title="清除记忆">
            <Trash2 size={16} className="text-apple-text-muted" />
          </button>
          <button onClick={() => setShowRules(true)} className="p-2 rounded-full bg-apple-surface hover:bg-apple-surface-hover transition-colors border border-apple-border" title="星轨法则">
            <BookOpen size={16} className="text-apple-text-muted" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar z-10 flex flex-col gap-6"
      >
        
        {/* Dynamic Card Display */}
        <AnimatePresence>
          {showCard && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0, margin: 0 }}
              className="w-full flex justify-center py-4 relative"
            >
              <div className="relative w-48 h-72 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-apple-border bg-apple-surface backdrop-blur-md flex flex-col items-center justify-center group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={cardImage}
                    initial={{ opacity: 0, y: 80, scale: 0.95 }}
                    animate={isCardAnimating ? { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      rotate: [-2, 2, -2, 2, 0],
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                    } : { opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={isCardAnimating ? { duration: 0.5 } : { duration: 0.6, type: "spring", bounce: 0.3 }}
                    src={cardImage} 
                    alt="Tarot Card" 
                    onClick={handleCardClick}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = "/default-card.png";
                    }}
                  />
                </AnimatePresence>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const content = window.prompt('写点什么分享到社区吧：', '今天进行了一次占卜，感觉充满了指引！✨');
                      if (content !== null) {
                        const newPost = {
                          id: Date.now(),
                          user: { name: userName, avatar: userAvatar },
                          time: '刚刚',
                          content,
                          cardImage: cardImage,
                          likes: 0,
                          comments: 0,
                          isLiked: false
                        };
                        setCommunityPosts([newPost, ...communityPosts]);
                        alert('已成功发布到星轨社区！');
                      }
                    }}
                    className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                    title="发布到社区"
                  >
                    <Sparkles size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({ title: '星轨占卜', text: '看看我的塔罗牌占卜结果！', url: cardImage });
                      } else {
                        handleCopy(cardImage);
                      }
                    }}
                    className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                    title="分享"
                  >
                    <Share size={14} />
                  </button>
                  <button 
                    onClick={() => setFullScreenImage(cardImage)}
                    className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                    title="全屏查看"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {isThinking && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-apple-surface backdrop-blur-md flex flex-col items-center justify-center overflow-hidden z-20"
                    >
                      {/* Outer Rotating Magic Circle */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute w-48 h-48 border-[1px] border-[#6B8AFF]/20 rounded-full flex items-center justify-center"
                      >
                        {/* Hexagram pattern */}
                        <div className="absolute w-full h-full border-[1px] border-[#6B8AFF]/10 rotate-45"></div>
                        <div className="absolute w-full h-full border-[1px] border-[#6B8AFF]/10 rotate-[135deg]"></div>
                      </motion.div>
                      
                      {/* Inner Rotating Dashed Ring */}
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-32 h-32 border-2 border-dashed border-[#6B8AFF]/30 rounded-full"
                      />
                      
                      {/* Pulsing Core */}
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-16 h-16 bg-gradient-to-tr from-[#6B8AFF]/20 to-[#D4AF37]/40 rounded-full blur-xl"
                      />
                      
                      {/* Center Icon */}
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="z-10 text-[#6B8AFF]"
                      >
                        <Sparkles size={28} />
                      </motion.div>

                      {/* Floating Particles */}
                      <motion.div 
                        animate={{ y: [-10, -30], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                        className="absolute w-1 h-1 bg-[#6B8AFF] rounded-full top-1/2 left-1/3"
                      />
                      <motion.div 
                        animate={{ y: [-10, -40], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
                        className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full top-1/2 right-1/3"
                      />

                      <span className="absolute bottom-8 text-[11px] font-serif text-[#6B8AFF] tracking-[0.2em] font-medium drop-shadow-sm">命运召唤中...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {floatingExp && (
                  <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#6B8AFF] font-bold text-xl drop-shadow-md"
                  >
                    +{floatingExp} EXP
                  </motion.div>
                )}
              </div>
              
              {/* Toggle Card Button */}
              <button 
                onClick={() => setShowCard(false)}
                className="absolute -bottom-2 bg-apple-surface backdrop-blur-xl border border-apple-border shadow-sm rounded-full p-1.5 text-apple-text-muted hover:text-apple-text transition-colors"
              >
                <ChevronDown size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showCard && (
          <div className="w-full flex justify-center">
            <button 
              onClick={() => setShowCard(true)}
              className="text-xs text-apple-text-muted hover:text-[#6B8AFF] transition-colors flex items-center gap-1 py-2"
            >
              <Sparkles size={12} /> 显示角色区域
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex flex-col gap-4 mt-auto">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "max-w-[85%] flex flex-col gap-1 group",
                msg.role === 'user' ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div className={clsx(
                "rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap",
                msg.role === 'user' 
                  ? "bg-[#6B8AFF] text-white rounded-tr-sm shadow-[0_4px_16px_rgba(107,138,255,0.3)]" 
                  : "bg-apple-surface backdrop-blur-xl text-apple-text rounded-tl-sm font-sans border border-apple-border"
              )}>
                {msg.cardImage && msg.cardImage !== 'default-card.png' && msg.cardImage !== '/default-card.png' && (
                  <div className="mb-3 flex justify-center">
                    <img 
                      src={msg.cardImage} 
                      alt="Drawn Tarot Card" 
                      className="w-32 h-48 object-cover rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-apple-border cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setFullScreenImage(msg.cardImage!)}
                    />
                  </div>
                )}
                {msg.text}
              </div>
              
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(msg.text)} className="p-1 text-apple-text-muted/40 hover:text-[#6B8AFF] transition-colors" title="复制">
                    <Copy size={12} />
                  </button>
                  <button onClick={() => handleRegenerate(msg.id)} disabled={isDrawing || isThinking} className="p-1 text-apple-text-muted/40 hover:text-[#6B8AFF] transition-colors disabled:opacity-30" title="重新生成">
                    <RefreshCw size={12} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start bg-apple-surface backdrop-blur-xl rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 border border-apple-border"
            >
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#6B8AFF]/80 rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#6B8AFF]/80 rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#6B8AFF]/80 rounded-full" />
            </motion.div>
          )}
          <div ref={chatEndRef} className="h-32 shrink-0" />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 z-20 relative">
        {/* Q-version Character (Draggable Pet) */}
        <motion.div 
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          className="absolute bottom-full mb-0 right-2 z-50 cursor-grab active:cursor-grabbing opacity-95 touch-none"
          whileDrag={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <AnimatePresence>
              {petMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-apple-surface backdrop-blur-sm text-[#6B8AFF] text-xs font-medium px-3 py-2 rounded-2xl shadow-lg border border-apple-border pointer-events-none"
                >
                  {petMessage}
                  {/* Speech bubble arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#141419]/90" />
                </motion.div>
              )}
            </AnimatePresence>
            <img 
              src="/default-pet.png" 
              alt="Guide" 
              className="w-28 h-28 object-contain drop-shadow-2xl pointer-events-none"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "https://image.pollinations.ai/prompt/chibi%20anime%20girl%20cute%20kawaii%20magical%20white%20background?width=300&height=300&nologo=true";
              }}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={scrollToTop}
              className="absolute -top-12 right-6 p-2 rounded-full bg-apple-surface text-apple-text-muted hover:bg-apple-surface hover:text-apple-text backdrop-blur-md transition-all z-30 border border-apple-border shadow-sm"
              title="回到顶部"
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Quick Prompts & Spreads */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={`quick-${idx}`}
                onClick={() => handleSend(prompt)}
                disabled={isDrawing || isThinking}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-apple-surface border border-apple-border text-xs text-apple-text-muted hover:text-apple-text hover:border-apple-border transition-all disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {SPREADS.map((spread, idx) => (
              <button
                key={`spread-${idx}`}
                onClick={() => handleSend(spread.prompt)}
                disabled={isDrawing || isThinking}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#6B8AFF]/10 border border-[#6B8AFF]/20 text-xs text-[#6B8AFF] hover:bg-[#6B8AFF]/20 transition-all disabled:opacity-50 flex items-center gap-1"
              >
                <Sparkles size={10} /> {spread.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center">
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isDrawing || isThinking}
            placeholder="倾诉你的心事..."
            className="w-full bg-apple-surface backdrop-blur-xl border border-apple-border rounded-full py-3.5 pl-5 pr-12 text-sm text-apple-text placeholder:text-apple-text-muted focus:outline-none focus:border-apple-accent/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isDrawing || isThinking}
            className="absolute right-1.5 w-9 h-9 rounded-full bg-[#6B8AFF] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-apple-surface-hover transition-colors shadow-[0_0_15px_rgba(107,138,255,0.4)]"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Card Overlay Animation */}
      <AnimatePresence>
        {showOverlayCard && overlayCardImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            {overlayCardName && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6 px-6 py-2 rounded-full bg-black/60 backdrop-blur-md text-white font-serif text-lg tracking-widest shadow-lg border border-apple-border"
              >
                {overlayCardName}
              </motion.div>
            )}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                boxShadow: [
                  "0 20px 40px rgba(0,0,0,0.2)",
                  "0 30px 60px rgba(255,255,255,0.4)",
                  "0 20px 40px rgba(0,0,0,0.2)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border border-apple-border"
            >
              <img 
                src={overlayCardImage} 
                alt="Drawn Tarot Card" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setFullScreenImage(null)}
          >
            <div className="absolute top-6 right-6 flex gap-4 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({ title: '星轨占卜', text: '看看我的塔罗牌占卜结果！', url: fullScreenImage });
                  } else {
                    handleCopy(fullScreenImage);
                  }
                }} 
                className="p-2 bg-apple-surface-hover rounded-full text-apple-text-muted hover:text-apple-text hover:bg-apple-surface-hover transition-colors"
                title="分享"
              >
                <Share size={20} />
              </button>
              <button onClick={() => setFullScreenImage(null)} className="p-2 bg-apple-surface-hover rounded-full text-apple-text-muted hover:text-apple-text hover:bg-apple-surface-hover transition-colors">
                <X size={24} />
              </button>
            </div>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              src={fullScreenImage} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              alt="Full screen tarot" 
              onClick={e => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1080";
              }}
            />
          </motion.div>
        )}

        {showFragmentDrop && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center border border-apple-border shadow-2xl"
            >
              <h3 className="font-sans font-bold text-2xl text-[#6B8AFF] mb-6">获得碎片</h3>
              <div className="text-6xl mb-4 drop-shadow-md">{showFragmentDrop.icon}</div>
              <div className="text-lg font-medium mb-2 text-apple-text">[{showFragmentDrop.rarity}] {showFragmentDrop.name}</div>
              <p className="text-sm text-apple-text-muted mb-8">{showFragmentDrop.desc}</p>
              <button 
                onClick={() => setShowFragmentDrop(null)}
                className="w-full py-3 rounded-xl bg-[#6B8AFF] text-white font-semibold shadow-[0_4px_15px_rgba(107,138,255,0.3)] hover:bg-[#4F46E5] transition-colors"
              >
                收下
              </button>
            </motion.div>
          </motion.div>
        )}

        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center border border-apple-border shadow-2xl"
            >
              <h3 className="font-sans font-bold text-2xl text-[#6B8AFF] mb-2">羁绊升级</h3>
              <p className="text-apple-text mb-6">
                你与少女的羁绊达到了 <br/>
                <span className="text-lg font-bold text-[#6B8AFF] mt-1 block">LV.{bondLevel} {LEVEL_TITLES[bondLevel-1]}</span>
              </p>
              <div className="w-full bg-apple-surface rounded-xl p-4 mb-6 text-sm text-left border border-apple-border">
                <div className="text-[#34C759] mb-2 font-medium">✨ +5 免费占卜次数</div>
                {bondLevel === 2 && <div className="text-[#AF52DE] font-medium">🔓 解锁: SR碎片掉落率提升</div>}
                {bondLevel === 3 && <div className="text-[#FF9500] font-medium">🔓 解锁: SSR碎片掉落率提升</div>}
                {bondLevel === 4 && <div className="text-[#6B8AFF] font-medium">🔓 解锁: 盲盒保底机制</div>}
                {bondLevel >= 5 && <div className="text-[#FF2D55] font-medium">🔓 解锁: 更亲密的专属对话语气</div>}
              </div>
              <button 
                onClick={() => { setEnergy(e => e + 5); setShowLevelUp(false); }}
                className="w-full py-3 rounded-xl bg-[#6B8AFF] text-white font-semibold shadow-[0_4px_15px_rgba(107,138,255,0.3)] hover:bg-[#4F46E5] transition-colors"
              >
                确认
              </button>
            </motion.div>
          </motion.div>
        )}

        {showClearConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center border border-apple-border shadow-2xl"
            >
              <h3 className="font-sans font-bold text-2xl text-apple-text mb-4">清除记忆</h3>
              <p className="text-apple-text-muted mb-8 text-sm">
                确定要清除所有对话记忆吗？此操作不可逆，但不会清除你的羁绊等级和碎片。
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-apple-surface text-apple-text-muted font-semibold hover:bg-apple-surface-hover hover:text-apple-text transition-colors border border-apple-border"
                >
                  取消
                </button>
                <button 
                  onClick={handleClearHistory}
                  className="flex-1 py-3 rounded-xl bg-rose-500/20 text-rose-400 font-semibold shadow-[0_4px_15px_rgba(244,63,94,0.2)] hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
                >
                  确认清除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center text-center relative border border-apple-border shadow-2xl"
            >
              <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-apple-text-muted hover:text-apple-text transition-colors"><X size={20}/></button>
              <h3 className="font-sans font-bold text-2xl text-apple-text mb-2">能量耗尽</h3>
              <p className="text-apple-text-muted text-sm mb-8 leading-relaxed">
                免费的占卜次数已用完。<br/>星轨需要更多的能量来维持连接...
              </p>
              <button 
                onClick={() => { setEnergy(5); setShowPaywall(false); }}
                className="w-full py-3 rounded-xl bg-apple-surface hover:bg-apple-surface-hover border border-apple-border text-apple-text font-medium transition-colors"
              >
                补充能量 (测试用+5)
              </button>
            </motion.div>
          </motion.div>
        )}

        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-apple-surface backdrop-blur-xl rounded-3xl p-6 flex flex-col relative border border-apple-border shadow-2xl"
            >
              <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-apple-text-muted hover:text-apple-text transition-colors"><X size={20}/></button>
              <h3 className="font-sans font-bold text-xl text-apple-text mb-6 text-center">星轨法则</h3>
              
              <div className="flex flex-col gap-4 text-sm">
                <div className="bg-apple-surface p-3 rounded-lg border border-apple-border">
                  <div className="font-medium text-apple-text mb-1">占卜规则</div>
                  <div className="text-apple-text-muted leading-relaxed">初始拥有 5 次免费占卜机会。每次占卜将消耗 1 次机会并增加羁绊经验。</div>
                </div>
                <div className="bg-apple-surface p-3 rounded-lg border border-apple-border">
                  <div className="font-medium text-apple-text mb-1">盲盒掉落</div>
                  <div className="text-apple-text-muted leading-relaxed">占卜后有几率掉落记忆碎片。分为 N, R, SR, SSR 四个稀有度。</div>
                </div>
                <div className="bg-apple-surface p-3 rounded-lg border border-apple-border">
                  <div className="font-medium text-apple-text mb-1">羁绊升级</div>
                  <div className="text-apple-text-muted leading-relaxed">升级可获得免费次数，并提升高稀有度碎片的掉落概率！</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
