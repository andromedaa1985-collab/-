import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Constants & Data ---
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000];
export const LEVEL_TITLES = ["萍水相逢", "星轨交汇", "灵魂共振", "命运羁绊", "星辰之主", "时空旅者", "造物之音", "永恒守护"];

export const FRAGMENTS_POOL = [
  { id: 'f1', name: '破碎的星光', rarity: 'N', icon: '✨', desc: '微弱的星光，似乎在诉说着什么。' },
  { id: 'f2', name: '占星者的草稿', rarity: 'N', icon: '📜', desc: '写满神秘符号的羊皮纸。' },
  { id: 'n3', name: '褪色的塔罗', rarity: 'N', icon: '🃏', desc: '边缘泛黄的普通纸牌，失去了魔力。' },
  { id: 'n4', name: '干枯的迷迭香', rarity: 'N', icon: '🌿', desc: '常用于占卜仪式的香草，已经失去了香气。' },
  { id: 'n5', name: '黯淡的水晶', rarity: 'N', icon: '💎', desc: '不再发光的廉价水晶碎块。' },
  { id: 'n6', name: '断裂的钟摆', rarity: 'N', icon: '🪀', desc: '曾经用来寻找失物的灵摆。' },
  { id: 'f3', name: '流泪的玫瑰', rarity: 'R', icon: '🌹', desc: '永不凋零，却永远在滴落露水。' },
  { id: 'f4', name: '破晓的提灯', rarity: 'R', icon: '🏮', desc: '能照亮迷途者前行的道路。' },
  { id: 'r3', name: '银月之镜', rarity: 'R', icon: '🪞', desc: '能在镜面中看到短暂的未来残影。' },
  { id: 'r4', name: '低语的海螺', rarity: 'R', icon: '🐚', desc: '贴在耳边能听到星海的潮汐声。' },
  { id: 'f5', name: '深渊的星屑', rarity: 'SR', icon: '🌌', desc: '来自宇宙深处的神秘物质。' },
  { id: 'f6', name: '逆流的沙漏', rarity: 'SR', icon: '⏳', desc: '据说能让时间短暂倒流。' },
  { id: 'sr3', name: '命运之轮的辐条', rarity: 'SR', icon: '🎡', desc: '命运之轮上脱落的碎片，蕴含改变运势的力量。' },
  { id: 'f7', name: '命运的纺锤', rarity: 'SSR', icon: '🧵', desc: '编织命运之线的神器。' },
  { id: 'f8', name: '愚者的王冠', rarity: 'SSR', icon: '👑', desc: '只有看破虚妄之人才能戴上。' },
];

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface Comment {
  id: number;
  user: { name: string; avatar: string | null };
  content: string;
  time: string;
}

export interface Post {
  id: number;
  user: { name: string; avatar: string | null };
  time: string;
  content: string;
  cardImage: string | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  commentsList?: Comment[];
}

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    user: { name: '月下漫步', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=c0aede' },
    time: '2小时前',
    content: '今天抽到了愚者牌，引路人告诉我这意味着新的开始和无限的可能。感觉最近的迷茫一扫而空了！✨',
    cardImage: 'https://image.pollinations.ai/prompt/the%20fool%20tarot%20card%20anime%20style%20magical?width=400&height=600&nologo=true',
    likes: 128,
    comments: 1,
    isLiked: false,
    commentsList: [
      {
        id: 101,
        user: { name: '占星学徒', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Apprentice&backgroundColor=ffdfbf' },
        content: '哇！愚者牌真的很好！祝你一切顺利！',
        time: '1小时前'
      }
    ]
  },
  {
    id: 2,
    user: { name: '星尘', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stardust&backgroundColor=b6e3f4' },
    time: '5小时前',
    content: '关于工作选择的占卜，命运之轮逆位。看来现在不是跳槽的好时机，需要再沉淀一下。星轨少女的解读真的很温柔，让我不再那么焦虑了。',
    cardImage: 'https://image.pollinations.ai/prompt/wheel%20of%20fortune%20tarot%20card%20anime%20style%20magical?width=400&height=600&nologo=true',
    likes: 85,
    comments: 0,
    isLiked: true,
    commentsList: []
  },
  {
    id: 3,
    user: { name: 'Seeker', avatar: null },
    time: '昨天',
    content: '终于把羁绊等级升到“灵魂共振”了！解锁了新的背景音乐，太好听了呜呜呜。',
    cardImage: null,
    likes: 342,
    comments: 0,
    isLiked: false,
    commentsList: []
  }
];

export interface AppSettings {
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  darkMode: boolean;
  bgmEnabled: boolean;
}

interface AppState {
  bondExp: number;
  setBondExp: React.Dispatch<React.SetStateAction<number>>;
  bondLevel: number;
  setBondLevel: React.Dispatch<React.SetStateAction<number>>;
  energy: number;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  fragments: any[];
  setFragments: React.Dispatch<React.SetStateAction<any[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  cardImage: string;
  setCardImage: React.Dispatch<React.SetStateAction<string>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userAvatar: string | null;
  setUserAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  communityPosts: Post[];
  setCommunityPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [bondExp, setBondExp] = useState(() => {
    const saved = localStorage.getItem('bondExp');
    return saved ? JSON.parse(saved) : 0;
  });
  const [bondLevel, setBondLevel] = useState(() => {
    const saved = localStorage.getItem('bondLevel');
    return saved ? JSON.parse(saved) : 1;
  });
  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    return saved ? JSON.parse(saved) : 5;
  });
  const [fragments, setFragments] = useState<any[]>(() => {
    const saved = localStorage.getItem('fragments');
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'init', 
        role: 'ai', 
        text: '你好呀，我是星轨的引路人。初次见面，让我为你指引前方的道路吧。✨\n\n在这里，你可以向我倾诉任何烦恼，我会为你抽取塔罗牌进行占卜。目前我掌握了以下几种占卜模式：\n1. **单张指引**：快速解答你当下的疑惑或提供今日运势。\n2. **圣三角**：通过三张牌分别解读你的过去、现在和未来。\n3. **爱情十字**：专门为你解析感情状况与发展趋势。\n4. **事业岔路**：当你面临选择时，帮你分析不同选择的走向。\n\n你可以直接点击下方的快捷按钮，或者在输入框告诉我你想占卜什么内容哦~', 
        timestamp: Date.now() 
      }
    ];
  });
  const [cardImage, setCardImage] = useState(() => {
    const saved = localStorage.getItem('cardImage');
    return saved ? JSON.parse(saved) : '/default-card.png';
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      voiceEnabled: true,
      hapticsEnabled: true,
      darkMode: false,
      bgmEnabled: false
    };
  });
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem('userName');
    return saved ? JSON.parse(saved) : '星轨旅人';
  });
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    const saved = localStorage.getItem('userAvatar');
    return saved ? JSON.parse(saved) : null;
  });
  const [communityPosts, setCommunityPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('communityPosts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem('bondExp', JSON.stringify(bondExp));
  }, [bondExp]);

  React.useEffect(() => {
    localStorage.setItem('bondLevel', JSON.stringify(bondLevel));
  }, [bondLevel]);

  React.useEffect(() => {
    localStorage.setItem('energy', JSON.stringify(energy));
  }, [energy]);

  React.useEffect(() => {
    localStorage.setItem('fragments', JSON.stringify(fragments));
  }, [fragments]);

  React.useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    localStorage.setItem('cardImage', JSON.stringify(cardImage));
  }, [cardImage]);

  React.useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  React.useEffect(() => {
    localStorage.setItem('userName', JSON.stringify(userName));
  }, [userName]);

  React.useEffect(() => {
    localStorage.setItem('userAvatar', JSON.stringify(userAvatar));
  }, [userAvatar]);

  React.useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  return (
    <AppContext.Provider value={{
      bondExp, setBondExp,
      bondLevel, setBondLevel,
      energy, setEnergy,
      fragments, setFragments,
      messages, setMessages,
      cardImage, setCardImage,
      settings, setSettings,
      userName, setUserName,
      userAvatar, setUserAvatar,
      communityPosts, setCommunityPosts,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
