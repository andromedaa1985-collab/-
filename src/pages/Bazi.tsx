import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Calendar, Clock, User, Sparkles, MapPin, RefreshCw, Loader2, Star, Heart, Briefcase, Zap, Leaf, Flame, Mountain, Gem, Waves, Library } from 'lucide-react';
import { useAppContext } from '../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Solar } from 'lunar-javascript';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
          voice_id: 'female-tianmei',
          speed: 1,
          vol: 1,
          pitch: 0
        }
      })
    });
    const data = await res.json();
    if (data.data && data.data.audio && audioElement) {
      const audioData = data.data.audio;
      const byteCharacters = atob(audioData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      audioElement.src = url;
      audioElement.play();
    }
  } catch (e) {
    console.error("MiniMax TTS Error:", e);
  }
};

interface BaziResult {
  bazi: {
    year: [string, string];
    month: [string, string];
    day: [string, string];
    hour: [string, string];
  };
  pattern: {
    name: string;
    description: string;
  };
  wuxing: {
    strength: string;
    favorable: string[];
    luckyColors: string[];
    luckyDirections: string[];
    luckyNumbers: number[];
    elements: {
      name: string;
      percentage: number;
      gods: string;
      isDayMaster?: boolean;
    }[];
  };
  tenGods: {
    name: string;
    percentage: number;
    color: string;
  }[];
  shensha: {
    category: string;
    items: string[];
  }[];
  dailyLuck: {
    score: number;
    summary: string;
    luckyHours: string;
  };
  readingText: string;
  personality: string;
  career: string;
  romance: string;
}

// ShenSha Calculation Helper
function calculateShenSha(bazi: { yearGan: string, yearZhi: string, monthGan: string, monthZhi: string, dayGan: string, dayZhi: string, timeGan: string, timeZhi: string }) {
  const { yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, timeGan, timeZhi } = bazi;
  const pillars = [
    { name: '年柱', gan: yearGan, zhi: yearZhi },
    { name: '月柱', gan: monthGan, zhi: monthZhi },
    { name: '日柱', gan: dayGan, zhi: dayZhi },
    { name: '时柱', gan: timeGan, zhi: timeZhi }
  ];

  const shensha: Record<string, string[]> = {
    '年柱': [],
    '月柱': [],
    '日柱': [],
    '时柱': []
  };

  const addSha = (pillarName: string, sha: string) => {
    if (!shensha[pillarName].includes(sha)) {
      shensha[pillarName].push(sha);
    }
  };

  const tianYi: Record<string, string[]> = { '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'], '乙': ['子', '申'], '己': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'], '壬': ['卯', '巳'], '癸': ['卯', '巳'], '辛': ['寅', '午'] };
  const taiJi: Record<string, string[]> = { '甲': ['子', '午'], '乙': ['子', '午'], '丙': ['卯', '酉'], '丁': ['卯', '酉'], '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'], '庚': ['寅', '亥'], '辛': ['寅', '亥'], '壬': ['巳', '申'], '癸': ['巳', '申'] };
  const wenChang: Record<string, string> = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
  const fuXing: Record<string, string[]> = { '甲': ['寅', '子'], '乙': ['丑', '亥'], '丙': ['子', '戌'], '丁': ['亥', '酉'], '戊': ['申'], '己': ['未'], '庚': ['午'], '辛': ['巳'], '壬': ['辰'], '癸': ['卯'] };
  const luShen: Record<string, string> = { '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳', '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子' };
  const yangRen: Record<string, string> = { '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午', '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑' };
  const taoHua: Record<string, string> = { '申': '酉', '子': '酉', '辰': '酉', '寅': '卯', '午': '卯', '戌': '卯', '亥': '子', '卯': '子', '未': '子', '巳': '午', '酉': '午', '丑': '午' };
  const yiMa: Record<string, string> = { '申': '寅', '子': '寅', '辰': '寅', '寅': '申', '午': '申', '戌': '申', '亥': '巳', '卯': '巳', '未': '巳', '巳': '亥', '酉': '亥', '丑': '亥' };
  const huaGai: Record<string, string> = { '申': '辰', '子': '辰', '辰': '辰', '寅': '戌', '午': '戌', '戌': '戌', '亥': '未', '卯': '未', '未': '未', '巳': '丑', '酉': '丑', '丑': '丑' };
  const jiangXing: Record<string, string> = { '申': '子', '子': '子', '辰': '子', '寅': '午', '午': '午', '戌': '午', '亥': '卯', '卯': '卯', '未': '卯', '巳': '酉', '酉': '酉', '丑': '酉' };
  const jieSha: Record<string, string> = { '申': '巳', '子': '巳', '辰': '巳', '寅': '亥', '午': '亥', '戌': '亥', '亥': '申', '卯': '申', '未': '申', '巳': '寅', '酉': '寅', '丑': '寅' };
  const wangShen: Record<string, string> = { '申': '亥', '子': '亥', '辰': '亥', '寅': '巳', '午': '巳', '戌': '巳', '亥': '寅', '卯': '寅', '未': '寅', '巳': '申', '酉': '申', '丑': '申' };
  const zaiSha: Record<string, string> = { '申': '午', '子': '午', '辰': '午', '寅': '子', '午': '子', '戌': '子', '亥': '酉', '卯': '酉', '未': '酉', '巳': '卯', '酉': '卯', '丑': '卯' };
  const liuE: Record<string, string> = { '申': '卯', '子': '卯', '辰': '卯', '寅': '酉', '午': '酉', '戌': '酉', '亥': '午', '卯': '午', '未': '午', '巳': '子', '酉': '子', '丑': '子' };
  const tianDe: Record<string, string> = { '子': '巳', '丑': '庚', '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙' };
  const yueDe: Record<string, string> = { '寅': '丙', '午': '丙', '戌': '丙', '申': '壬', '子': '壬', '辰': '壬', '亥': '甲', '卯': '甲', '未': '甲', '巳': '庚', '酉': '庚', '丑': '庚' };
  const tianDeHe: Record<string, string> = { '子': '申', '丑': '乙', '寅': '壬', '卯': '巳', '辰': '丁', '巳': '丙', '午': '寅', '未': '己', '申': '戊', '酉': '亥', '戌': '辛', '亥': '庚' };
  const yueDeHe: Record<string, string> = { '寅': '辛', '午': '辛', '戌': '辛', '申': '丁', '子': '丁', '辰': '丁', '亥': '己', '卯': '己', '未': '己', '巳': '乙', '酉': '乙', '丑': '乙' };
  const deXiu: Record<string, string[]> = { '寅': ['丙', '丁', '戊', '癸'], '午': ['丙', '丁', '戊', '癸'], '戌': ['丙', '丁', '戊', '癸'], '申': ['壬', '癸', '戊', '己', '丙', '辛', '甲'], '子': ['壬', '癸', '戊', '己', '丙', '辛', '甲'], '辰': ['壬', '癸', '戊', '己', '丙', '辛', '甲'], '亥': ['甲', '乙', '丁', '壬'], '卯': ['甲', '乙', '丁', '壬'], '未': ['甲', '乙', '丁', '壬'], '巳': ['庚', '辛', '乙'], '酉': ['庚', '辛', '乙'], '丑': ['庚', '辛', '乙'] };
  const hongLuan: Record<string, string> = { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' };
  const tianXi: Record<string, string> = { '子': '酉', '丑': '申', '寅': '未', '卯': '午', '辰': '巳', '巳': '辰', '午': '卯', '未': '寅', '申': '丑', '酉': '子', '戌': '亥', '亥': '戌' };
  const guChen: Record<string, string> = { '亥': '寅', '子': '寅', '丑': '寅', '寅': '巳', '卯': '巳', '辰': '巳', '巳': '申', '午': '申', '未': '申', '申': '亥', '酉': '亥', '戌': '亥' };
  const guaSu: Record<string, string> = { '亥': '戌', '子': '戌', '丑': '戌', '寅': '丑', '卯': '丑', '辰': '丑', '巳': '辰', '午': '辰', '未': '辰', '申': '未', '酉': '未', '戌': '未' };
  const tianYiXing: Record<string, string> = { '寅': '丑', '卯': '寅', '辰': '卯', '巳': '辰', '午': '巳', '未': '午', '申': '未', '酉': '申', '戌': '酉', '亥': '戌', '子': '亥', '丑': '子' };

  pillars.forEach(pillar => {
    if (tianYi[dayGan]?.includes(pillar.zhi) || tianYi[yearGan]?.includes(pillar.zhi)) addSha(pillar.name, '天乙贵人');
    if (taiJi[dayGan]?.includes(pillar.zhi) || taiJi[yearGan]?.includes(pillar.zhi)) addSha(pillar.name, '太极贵人');
    if (wenChang[dayGan] === pillar.zhi || wenChang[yearGan] === pillar.zhi) addSha(pillar.name, '文昌贵人');
    if (fuXing[dayGan]?.includes(pillar.zhi) || fuXing[yearGan]?.includes(pillar.zhi)) addSha(pillar.name, '福星贵人');
    if (luShen[dayGan] === pillar.zhi) addSha(pillar.name, '禄神');
    if (yangRen[dayGan] === pillar.zhi) addSha(pillar.name, '羊刃');
    if (taoHua[yearZhi] === pillar.zhi || taoHua[dayZhi] === pillar.zhi) addSha(pillar.name, '桃花');
    if (yiMa[yearZhi] === pillar.zhi || yiMa[dayZhi] === pillar.zhi) addSha(pillar.name, '驿马');
    if (huaGai[yearZhi] === pillar.zhi || huaGai[dayZhi] === pillar.zhi) addSha(pillar.name, '华盖');
    if (jiangXing[yearZhi] === pillar.zhi || jiangXing[dayZhi] === pillar.zhi) addSha(pillar.name, '将星');
    if (jieSha[yearZhi] === pillar.zhi || jieSha[dayZhi] === pillar.zhi) addSha(pillar.name, '劫煞');
    if (wangShen[yearZhi] === pillar.zhi || wangShen[dayZhi] === pillar.zhi) addSha(pillar.name, '亡神');
    if (zaiSha[yearZhi] === pillar.zhi || zaiSha[dayZhi] === pillar.zhi) addSha(pillar.name, '灾煞');
    if (liuE[yearZhi] === pillar.zhi || liuE[dayZhi] === pillar.zhi) addSha(pillar.name, '六厄');
    if (tianDe[monthZhi] === pillar.zhi || tianDe[monthZhi] === pillar.gan) addSha(pillar.name, '天德贵人');
    if (yueDe[monthZhi] === pillar.gan) addSha(pillar.name, '月德贵人');
    if (tianDeHe[monthZhi] === pillar.gan) addSha(pillar.name, '天德合');
    if (yueDeHe[monthZhi] === pillar.gan) addSha(pillar.name, '月德合');
    if (deXiu[monthZhi]?.includes(pillar.gan)) addSha(pillar.name, '德秀贵人');
    if (tianYiXing[monthZhi] === pillar.zhi) addSha(pillar.name, '天医');
    if (hongLuan[yearZhi] === pillar.zhi) addSha(pillar.name, '红鸾');
    if (tianXi[yearZhi] === pillar.zhi) addSha(pillar.name, '天喜');
    if (guChen[yearZhi] === pillar.zhi) addSha(pillar.name, '孤辰');
    if (guaSu[yearZhi] === pillar.zhi) addSha(pillar.name, '寡宿');
  });

  return shensha;
}

export default function Bazi() {
  const { settings, energy, setEnergy, baziResult, setBaziResult, baziFormData, setBaziFormData, baziMessages, setBaziMessages, profiles, setProfiles, activeProfileId, setActiveProfileId } = useAppContext();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const prevActiveProfileIdRef = useRef<string | null>(activeProfileId);

  React.useEffect(() => {
    if (activeProfileId) {
      const profile = profiles.find(p => p.id === activeProfileId);
      if (profile) {
        setBaziFormData({
          name: profile.name,
          gender: profile.gender,
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          birthLocation: profile.birthLocation,
          currentLocation: profile.currentLocation
        });
        
        // Only clear result if we actually switched to a different profile
        if (prevActiveProfileIdRef.current !== null && prevActiveProfileIdRef.current !== activeProfileId) {
          setBaziResult(null);
          setBaziMessages([]);
        }
      }
    }
    prevActiveProfileIdRef.current = activeProfileId;
  }, [activeProfileId, profiles, setBaziFormData, setBaziResult, setBaziMessages]);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [baziMessages]);

  const handleCalculate = async () => {
    if (!baziFormData.name || !baziFormData.birthDate || !baziFormData.birthTime || !baziFormData.birthLocation || !baziFormData.currentLocation) return;
    if (energy <= 0) {
      alert("能量不足，请先补充能量！");
      return;
    }

    // Auto-save to profiles
    const existingProfile = profiles.find(p => p.name === baziFormData.name && p.birthDate === baziFormData.birthDate);
    if (!existingProfile) {
      const newProfile = {
        id: Date.now().toString(),
        name: baziFormData.name,
        gender: baziFormData.gender,
        birthDate: baziFormData.birthDate,
        birthTime: baziFormData.birthTime,
        birthLocation: baziFormData.birthLocation,
        currentLocation: baziFormData.currentLocation
      };
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    } else {
      setActiveProfileId(existingProfile.id);
    }

    setIsCalculating(true);
    setBaziResult(null);
    setBaziMessages([]);
    setEnergy(prev => prev - 1);

    try {
      const [yearStr, monthStr, dayStr] = baziFormData.birthDate.split('-');
      const [hourStr, minuteStr] = baziFormData.birthTime.split(':');
      
      const solar = Solar.fromYmdHms(
        parseInt(yearStr), 
        parseInt(monthStr), 
        parseInt(dayStr), 
        parseInt(hourStr), 
        parseInt(minuteStr), 
        0
      );
      const lunar = solar.getLunar();
      const baZi = lunar.getEightChar();
      
      const exactBazi = {
        year: [baZi.getYearGan(), baZi.getYearZhi()] as [string, string],
        month: [baZi.getMonthGan(), baZi.getMonthZhi()] as [string, string],
        day: [baZi.getDayGan(), baZi.getDayZhi()] as [string, string],
        hour: [baZi.getTimeGan(), baZi.getTimeZhi()] as [string, string]
      };

      // Calculate WuXing
      const wuxingStr = baZi.getYearWuXing() + baZi.getMonthWuXing() + baZi.getDayWuXing() + baZi.getTimeWuXing();
      const wuxingCounts: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
      for (let i = 0; i < wuxingStr.length; i++) {
        if (wuxingCounts[wuxingStr[i]] !== undefined) {
          wuxingCounts[wuxingStr[i]]++;
        }
      }

      const dayMasterElement = baZi.getDayWuXing()[0];
      const exactElements = Object.keys(wuxingCounts).map(name => ({
        name,
        percentage: Math.round((wuxingCounts[name] / 8) * 100),
        gods: "", // Will be filled by LLM or left empty
        isDayMaster: name === dayMasterElement
      }));

      // Calculate Ten Gods
      const tenGodsList = [
        baZi.getYearShiShenGan(),
        baZi.getYearShiShenZhi()[0],
        baZi.getMonthShiShenGan(),
        baZi.getMonthShiShenZhi()[0],
        baZi.getDayShiShenZhi()[0],
        baZi.getTimeShiShenGan(),
        baZi.getTimeShiShenZhi()[0]
      ];

      const tenGodsCounts: Record<string, number> = {
        "比肩": 0, "劫财": 0, "食神": 0, "伤官": 0, "正财": 0, "偏财": 0, "正官": 0, "七杀": 0, "正印": 0, "偏印": 0
      };

      tenGodsList.forEach(god => {
        if (tenGodsCounts[god] !== undefined) {
          tenGodsCounts[god]++;
        }
      });

      const defaultColors: Record<string, string> = {
        "比肩": "#FF8A80", "劫财": "#FF5252", 
        "食神": "#FFD180", "伤官": "#FFAB40", 
        "正财": "#FFE57F", "偏财": "#FFD740", 
        "正官": "#80D8FF", "七杀": "#40C4FF", 
        "正印": "#B9F6CA", "偏印": "#69F0AE"
      };

      const exactTenGods = Object.keys(tenGodsCounts).map(name => ({
        name,
        percentage: Math.round((tenGodsCounts[name] / 7) * 100),
        color: defaultColors[name]
      }));
      
      // Calculate ShenSha precisely
      const shenshaData = calculateShenSha({
        yearGan: baZi.getYearGan(), yearZhi: baZi.getYearZhi(),
        monthGan: baZi.getMonthGan(), monthZhi: baZi.getMonthZhi(),
        dayGan: baZi.getDayGan(), dayZhi: baZi.getDayZhi(),
        timeGan: baZi.getTimeGan(), timeZhi: baZi.getTimeZhi()
      });

      const exactBaziStr = `年柱：${baZi.getYear()}，月柱：${baZi.getMonth()}，日柱：${baZi.getDay()}，时柱：${baZi.getTime()}
五行分布：${JSON.stringify(exactElements)}
十神分布：${JSON.stringify(exactTenGods)}
神煞分布：
年柱神煞：${shenshaData['年柱'].join('、') || '无'}
月柱神煞：${shenshaData['月柱'].join('、') || '无'}
日柱神煞：${shenshaData['日柱'].join('、') || '无'}
时柱神煞：${shenshaData['时柱'].join('、') || '无'}`;

      const prompt = `用户姓名：${baziFormData.name}
性别：${baziFormData.gender === 'male' ? '男' : '女'}
出生日期（公历）：${baziFormData.birthDate}
出生时间：${baziFormData.birthTime}
出生地：${baziFormData.birthLocation}
现居地：${baziFormData.currentLocation}

【重要：我已经为你精确计算了该用户的八字、五行、十神和神煞，请务必严格基于此数据进行推演，绝不能自己瞎算！】
精确八字与神煞：
${exactBaziStr}

请你扮演一位精通中国传统命理、八字排盘的国学大师。请根据上述精确八字和神煞，进行八字排盘和命理分析。
必须返回合法的JSON格式，结构如下：
{
  "pattern": {
    "name": "格局名称（必须是传统八字标准格局，如：正官格、七杀格、正印格、偏印格、食神格、伤官格、正财格、偏财格、建禄格、羊刃格、杂气伤官格等，绝不能用长句描述）",
    "description": "格局简述（一句话描述该格局的特点）"
  },
  "wuxing": {
    "strength": "身强/身弱",
    "favorable": ["喜用神1", "喜用神2"],
    "luckyColors": ["颜色1", "颜色2"],
    "luckyDirections": ["方位1", "方位2"],
    "luckyNumbers": [数字1, 数字2]
  },
  "shensha": [
    { "category": "吉神相助", "items": ["吉神1", "吉神2"] },
    { "category": "凶煞警惕", "items": ["凶煞1", "凶煞2"] },
    { "category": "其他神煞", "items": ["其他神煞1", "其他神煞2"] }
  ],
  "dailyLuck": {
    "score": 85,
    "summary": "今日运势简述（50字左右）",
    "luckyHours": "吉时（如：辰时 07:00-09:00）"
  },
  "readingText": "一段用于语音播报的口语化总结，语气要专业、神秘、温和，像大师面对面解惑（约200字）",
  "personality": "性格特质分析（100字左右）",
  "career": "近期事业/学业运势预测（100字左右）",
  "romance": "感情运势预测（100字左右）"
}
注意：
1. 神煞部分【必须完全使用我提供的精确神煞数据】，将其分类为“吉神相助”、“凶煞警惕”、“其他神煞”三类，【一个都不能漏掉】！绝对不能自己编造或遗漏。
2. 请严格按照上述 JSON 结构返回，不要包含任何其他文字或Markdown标记。`;

      let aiText = "";
      
      try {
        const res = await fetch('/api/deepseek/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            temperature: 0.1,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: '你是一位精通八字命理的国学大师。请务必返回合法的JSON对象。' },
              { role: 'user', content: prompt }
            ]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        aiText = data.choices[0].message.content;
      } catch (err) {
        console.error("DeepSeek Error:", err);
        aiText = "{}";
      }

      // Clean up potential markdown formatting from the response
      const cleanedText = aiText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResult = JSON.parse(cleanedText);
      
      // Merge exact calculations with LLM interpretations
      const finalResult: BaziResult = {
        bazi: exactBazi,
        pattern: parsedResult.pattern,
        wuxing: {
          ...parsedResult.wuxing,
          elements: exactElements
        },
        tenGods: exactTenGods,
        shensha: parsedResult.shensha,
        dailyLuck: parsedResult.dailyLuck,
        readingText: parsedResult.readingText,
        personality: parsedResult.personality,
        career: parsedResult.career,
        romance: parsedResult.romance
      };

      setBaziResult(finalResult);
      setBaziMessages([{
        id: Date.now().toString(),
        role: 'ai',
        text: `你好，${baziFormData.name}。我已经为你排好了八字。关于你的命理，有什么想进一步了解的吗？`,
        timestamp: Date.now()
      }]);

      if (settings.voiceEnabled) {
        playVoiceMiniMax(finalResult.readingText, audioRef.current);
      }

    } catch (error: any) {
      console.error("Bazi Calculation Error:", error);
      alert(`推演失败: ${error.message || "未知错误，请稍后再试"}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !baziResult) return;
    
    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      text: chatInput,
      timestamp: Date.now()
    };
    
    setBaziMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const contextPrompt = `你是一位精通八字命理的国学大师，正在与缘主面对面交流。
用户八字排盘结果如下：
${JSON.stringify(baziResult, null, 2)}

请根据上述八字信息，回答用户的提问。
【重要要求】：
1. 语气要专业、神秘、温和，充满人文关怀，就像一位真正的国学大师在面对面解惑。
2. 绝对不要使用任何 Markdown 格式（如 **加粗**、# 标题、* 列表等），请使用纯文本格式，段落之间用换行分隔即可。
3. 绝对不要说“作为AI”、“根据提供的数据”等暴露人工智能身份的词语，要完全沉浸在大师的角色中。

用户的问题是：${chatInput}`;

      let aiText = "";
      try {
        const res = await fetch('/api/deepseek/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-reasoner',
            messages: [
              { role: 'system', content: '你是一位精通八字命理的国学大师。' },
              ...baziMessages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
              { role: 'user', content: contextPrompt }
            ]
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        aiText = data.choices[0].message.content;
      } catch (err) {
        console.error("DeepSeek Error:", err);
        aiText = "天机不可泄露...";
      }

      // Clean up any residual markdown
      aiText = aiText.replace(/\*\*/g, '').replace(/#/g, '');

      setBaziMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: aiText,
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setBaziMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "星轨受到干扰，我暂时无法回答你的问题，请稍后再试。",
        timestamp: Date.now()
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-full w-full px-4 pt-6 pb-32 relative text-apple-text">
      <audio ref={audioRef} className="hidden" />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-apple-gold/10 to-transparent pointer-events-none"></div>
      
      <div className="flex flex-col items-center mb-8 relative z-10">
        <h1 className="font-sans text-3xl font-bold tracking-widest text-apple-gold mb-2 flex items-center gap-2">
          <Compass size={28} />
          生辰八字
        </h1>
        <p className="text-apple-text-muted text-sm tracking-widest">洞悉命理，指引前程</p>
      </div>

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {!baziResult && !isCalculating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="space-y-5">
              {profiles.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                    <Library size={16} /> 快速选择档案
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {profiles.map(profile => (
                      <button
                        key={profile.id}
                        onClick={() => setActiveProfileId(profile.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                          activeProfileId === profile.id
                            ? "bg-apple-gold/20 text-apple-gold border-apple-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                            : "bg-apple-surface text-apple-text-muted border-apple-border hover:border-apple-gold/30"
                        )}
                      >
                        {profile.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setActiveProfileId(null);
                        setBaziResult(null);
                        setBaziMessages([]);
                        setBaziFormData({
                          name: '',
                          gender: 'male',
                          birthDate: '',
                          birthTime: '',
                          birthLocation: '',
                          currentLocation: ''
                        });
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border bg-apple-surface text-apple-text-muted border-apple-border hover:border-apple-gold/30"
                    >
                      + 新档案
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                  <User size={16} /> 姓名/称呼
                </label>
                <input 
                  type="text" 
                  value={baziFormData.name}
                  onChange={e => setBaziFormData({...baziFormData, name: e.target.value})}
                  placeholder="输入你的名字"
                  className="w-full bg-apple-surface border border-apple-border rounded-2xl px-5 py-3.5 text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 ml-1">性别</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setBaziFormData({...baziFormData, gender: 'male'})}
                    className={cn(
                      "flex-1 py-3.5 rounded-2xl border transition-all font-medium",
                      baziFormData.gender === 'male' 
                        ? "bg-apple-gold/20 text-apple-gold border-apple-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                        : "bg-apple-surface border-apple-border text-apple-text-muted"
                    )}
                  >
                    男
                  </button>
                  <button 
                    onClick={() => setBaziFormData({...baziFormData, gender: 'female'})}
                    className={cn(
                      "flex-1 py-3.5 rounded-2xl border transition-all font-medium",
                      baziFormData.gender === 'female' 
                        ? "bg-apple-gold/20 text-apple-gold border-apple-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                        : "bg-apple-surface border-apple-border text-apple-text-muted"
                    )}
                  >
                    女
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                  <Calendar size={16} /> 出生日期 (公历)
                </label>
                <input 
                  type="date" 
                  value={baziFormData.birthDate}
                  onChange={e => setBaziFormData({...baziFormData, birthDate: e.target.value})}
                  className="w-full bg-apple-surface border border-apple-border rounded-2xl px-5 py-3.5 text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                  <Clock size={16} /> 出生时间
                </label>
                <input 
                  type="time" 
                  value={baziFormData.birthTime}
                  onChange={e => setBaziFormData({...baziFormData, birthTime: e.target.value})}
                  className="w-full bg-apple-surface border border-apple-border rounded-2xl px-5 py-3.5 text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                  <MapPin size={16} /> 出生地
                </label>
                <input 
                  type="text" 
                  value={baziFormData.birthLocation}
                  onChange={e => setBaziFormData({...baziFormData, birthLocation: e.target.value})}
                  placeholder="如：北京市朝阳区"
                  className="w-full bg-apple-surface border border-apple-border rounded-2xl px-5 py-3.5 text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gold mb-2 flex items-center gap-2 ml-1">
                  <MapPin size={16} /> 现居地
                </label>
                <input 
                  type="text" 
                  value={baziFormData.currentLocation}
                  onChange={e => setBaziFormData({...baziFormData, currentLocation: e.target.value})}
                  placeholder="如：上海市浦东新区"
                  className="w-full bg-apple-surface border border-apple-border rounded-2xl px-5 py-3.5 text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              {energy <= 0 ? (
                <button 
                  onClick={() => setEnergy(5)}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-medium shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  能量不足，点击补充能量
                </button>
              ) : (
                <button 
                  onClick={handleCalculate}
                  disabled={!baziFormData.name || !baziFormData.birthDate || !baziFormData.birthTime || !baziFormData.birthLocation || !baziFormData.currentLocation}
                  className="w-full mt-8 bg-gradient-to-r from-apple-gold to-[#B8860B] text-black py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  开始推演 (消耗 1 能量)
                </button>
              )}
            </div>
          </motion.div>
        )}

        {isCalculating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-apple-gold/20 rounded-full blur-xl animate-pulse"></div>
              <Compass className="w-16 h-16 text-apple-gold animate-spin-slow relative z-10" />
            </div>
            <p className="mt-6 text-apple-gold font-sans tracking-widest animate-pulse">正在推演星轨与命理...</p>
          </motion.div>
        )}

        {baziResult && !isCalculating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Bazi Chart Card */}
            <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-apple-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="font-sans text-xl font-bold text-apple-gold flex items-center gap-2">
                  <Compass size={20} />
                  生辰排盘
                </h2>
                <button 
                  onClick={() => setBaziResult(null)}
                  className="flex items-center gap-1 text-sm text-apple-text-muted hover:text-apple-gold transition-colors bg-apple-surface px-3 py-1.5 rounded-full border border-apple-border"
                >
                  <RefreshCw size={14} /> 重新测算
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6 relative z-10">
                {[
                  { label: '年柱', data: baziResult.bazi.year },
                  { label: '月柱', data: baziResult.bazi.month },
                  { label: '日柱', data: baziResult.bazi.day },
                  { label: '时柱', data: baziResult.bazi.hour }
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-xs text-apple-text-muted mb-2 tracking-widest">{col.label}</div>
                    <div className="w-full bg-apple-surface border border-apple-border rounded-2xl py-5 flex flex-col items-center gap-4 shadow-sm">
                      <span className="font-serif text-2xl font-bold text-apple-text">{col.data[0]}</span>
                      <div className="w-6 h-px bg-apple-gold/30"></div>
                      <span className="font-serif text-2xl font-bold text-apple-text">{col.data[1]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pattern */}
              <div className="bg-apple-surface rounded-2xl p-4 border border-apple-border relative z-10">
                <div className="flex items-start gap-3">
                  <div className="bg-apple-gold/20 text-apple-gold border border-apple-gold/30 text-xs font-bold px-2 py-1 rounded mt-0.5 whitespace-nowrap">格局</div>
                  <div>
                    <h4 className="font-bold text-apple-text mb-1">{baziResult.pattern.name}</h4>
                    <p className="text-sm text-apple-text-muted">{baziResult.pattern.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Luck Card */}
            {baziResult.dailyLuck && (
              <div className="bg-gradient-to-br from-apple-gold/20 to-[#B8860B]/10 border border-apple-gold/30 rounded-[2rem] p-6 shadow-lg text-apple-text relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-apple-surface rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-apple-gold">
                  <Sparkles size={20} className="text-apple-gold" />
                  今日运势
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-apple-gold/30 bg-apple-surface-hover backdrop-blur-sm">
                    <span className="text-2xl font-bold font-serif text-apple-gold">{baziResult.dailyLuck.score}</span>
                    <span className="text-[10px] opacity-80 text-apple-gold">分</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-apple-text mb-2">{baziResult.dailyLuck.summary}</p>
                    <div className="inline-block bg-apple-surface-hover border border-apple-border px-3 py-1 rounded-lg text-xs backdrop-blur-sm text-apple-gold">
                      吉时：{baziResult.dailyLuck.luckyHours}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wuxing & Favorable Elements */}
            <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <h3 className="font-serif text-lg font-bold text-apple-gold mb-4 flex items-center gap-2">
                <Zap size={20} />
                五行强弱与喜用
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-apple-gold/20 border border-apple-gold/30 text-apple-gold px-4 py-2 rounded-xl font-bold font-serif text-lg">
                  {baziResult.wuxing.strength}
                </div>
                <div className="flex-1 bg-apple-surface rounded-xl p-3 border border-apple-border flex items-center justify-center gap-2">
                  <span className="text-sm text-apple-text-muted">喜用神</span>
                  <span className="font-bold text-apple-text">{baziResult.wuxing.favorable.join('、')}</span>
                </div>
              </div>

              {/* Simple Wuxing Bars */}
              <div className="space-y-4 mt-6">
                {baziResult.wuxing.elements.map((el: any, idx: number) => {
                  const colors: Record<string, string> = {
                    '木': 'bg-[#4ADE80]',
                    '火': 'bg-[#F87171]',
                    '土': 'bg-[#FBBF24]',
                    '金': 'bg-[#9CA3AF]',
                    '水': 'bg-[#60A5FA]'
                  };
                  
                  const getWuxingIcon = (name: string) => {
                    switch (name) {
                      case '木': return <Leaf size={24} className="text-[#4ADE80] mb-1 drop-shadow-sm" />;
                      case '火': return <Flame size={24} className="text-[#F87171] mb-1 drop-shadow-sm" />;
                      case '土': return <Mountain size={24} className="text-[#FBBF24] mb-1 drop-shadow-sm" />;
                      case '金': return <Gem size={24} className="text-[#9CA3AF] mb-1 drop-shadow-sm" />;
                      case '水': return <Waves size={24} className="text-[#60A5FA] mb-1 drop-shadow-sm" />;
                      default: return <Sparkles size={24} className="text-apple-text-muted mb-1" />;
                    }
                  };

                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-10 flex flex-col items-center relative">
                        {getWuxingIcon(el.name)}
                        <span className="font-bold text-xs text-apple-text">{el.name}</span>
                        {el.isDayMaster && <span className="absolute -top-1 -right-2 text-[8px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">主</span>}
                      </div>
                      <div className="flex-1 h-3 bg-apple-surface rounded-full overflow-hidden border border-apple-border">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${el.percentage}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={cn("h-full rounded-full", colors[el.name] || 'bg-gray-400')}
                        />
                      </div>
                      <div className="w-10 text-right text-apple-text-muted font-medium">{el.percentage}%</div>
                      <div className="w-20 text-xs text-apple-text-muted truncate">{el.gods}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-apple-surface rounded-xl p-3 border border-apple-border text-center">
                  <div className="text-xs text-apple-text-muted mb-1">幸运颜色</div>
                  <div className="text-sm font-bold text-apple-text">{baziResult.wuxing.luckyColors.join(' ')}</div>
                </div>
                <div className="bg-apple-surface rounded-xl p-3 border border-apple-border text-center">
                  <div className="text-xs text-apple-text-muted mb-1">幸运方位</div>
                  <div className="text-sm font-bold text-apple-text">{baziResult.wuxing.luckyDirections.join(' ')}</div>
                </div>
                <div className="bg-apple-surface rounded-xl p-3 border border-apple-border text-center">
                  <div className="text-xs text-apple-text-muted mb-1">幸运数字</div>
                  <div className="text-sm font-bold text-apple-text">{baziResult.wuxing.luckyNumbers.join(' ')}</div>
                </div>
              </div>
            </div>

            {/* Ten Gods Chart */}
            <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <h3 className="font-serif text-lg font-bold text-apple-gold mb-6 flex items-center gap-2">
                <Star size={20} />
                十神占比
              </h3>
              <div className="flex h-48 items-end gap-1 justify-between pt-4">
                {baziResult.tenGods.map((god: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full">
                    <div className="text-[10px] text-apple-text-muted mb-1">{god.percentage}%</div>
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(god.percentage, 2)}%` }}
                        transition={{ duration: 1, delay: idx * 0.05 }}
                        className="w-full rounded-t-md opacity-80 absolute bottom-0"
                        style={{ backgroundColor: god.color }}
                      />
                    </div>
                    <div className="text-xs font-medium text-apple-text mt-2" style={{ writingMode: 'vertical-rl' }}>{god.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shensha */}
            <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <h3 className="font-serif text-lg font-bold text-apple-gold mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                神煞解析
              </h3>
              <div className="space-y-4">
                {baziResult.shensha.map((group: any, idx: number) => {
                  const isBad = group.category.includes('凶') || group.category.includes('煞') || group.category.includes('忌');
                  return (
                    <div key={idx}>
                      <div className={cn(
                        "text-sm font-bold mb-2 flex items-center gap-2",
                        isBad ? "text-rose-400" : "text-apple-gold"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isBad ? "bg-rose-500" : "bg-apple-gold"
                        )}></div>
                        {group.category}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item: string, i: number) => (
                          <span key={i} className={cn(
                            "px-3 py-1.5 rounded-lg text-sm shadow-sm border",
                            isBad 
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-300" 
                              : "bg-apple-surface border-apple-border text-apple-text"
                          )}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analysis Cards */}
            <div className="grid grid-cols-1 gap-4">
              <AnalysisCard 
                icon={<User className="text-apple-gold" size={20} />} 
                title="性格特质" 
                content={baziResult.personality} 
              />
              <AnalysisCard 
                icon={<Briefcase className="text-apple-gold" size={20} />} 
                title="事业学业" 
                content={baziResult.career} 
              />
              <AnalysisCard 
                icon={<Heart className="text-apple-gold" size={20} />} 
                title="感情运势" 
                content={baziResult.romance} 
              />
            </div>

            {/* Chat Interface */}
            <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] mt-8">
              <h3 className="font-serif text-lg font-bold text-apple-gold mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                大师解惑
              </h3>
              
              <div 
                ref={chatContainerRef}
                className="h-64 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#D4AF37]/50 scrollbar-track-transparent"
              >
                {baziMessages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-apple-gold/20 text-apple-gold border border-apple-gold/30 rounded-br-sm" 
                        : "bg-apple-surface border border-apple-border text-apple-text rounded-bl-sm"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-apple-surface border border-apple-border rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-apple-gold" />
                      <span className="text-sm text-apple-text-muted">大师正在推演...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="关于八字，你还有什么想问的？"
                  className="flex-1 bg-apple-surface border border-apple-border rounded-xl px-4 py-3 text-sm text-apple-text focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all placeholder:text-apple-text-muted"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatting}
                  className="bg-apple-gold/20 border border-apple-gold/30 text-apple-gold px-4 py-3 rounded-xl hover:bg-apple-gold/30 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  发送
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}

function AnalysisCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="bg-apple-surface backdrop-blur-xl border border-apple-border rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-apple-surface border border-apple-border">
          {icon}
        </div>
        <h3 className="font-serif text-lg font-bold text-apple-text">{title}</h3>
      </div>
      <p className="text-sm text-apple-text-muted leading-relaxed">
        {content}
      </p>
    </div>
  );
}
