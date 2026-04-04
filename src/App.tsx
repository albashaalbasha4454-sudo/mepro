/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Cpu, 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  Youtube, 
  Facebook, 
  Send,
  CheckCircle2,
  ArrowLeft,
  Layout,
  Figma,
  Smartphone,
  Video,
  Palette,
  BarChart3,
  ExternalLink,
  Briefcase,
  Rocket,
  Layers,
  Check,
  Lightbulb,
  PenTool,
  Megaphone,
  Brain,
  Star,
  Award,
  ShieldCheck,
  Edit,
  ShoppingCart,
  Globe,
  Heart,
  Gem,
  Gift,
  BarChart2,
  Eye,
  Link as LinkIcon,
  Share2,
  Twitter,
  Trophy,
  Sparkles,
  Lock,
  Printer,
  FileText,
  CheckSquare,
  Headphones,
  Truck,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="mb-8 flex items-center justify-center gap-3">
    {Icon && <Icon className="w-6 h-6 text-amber-500" />}
    <h2 className="text-2xl md:text-3xl font-bold text-white">
      {children}
    </h2>
  </div>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-brand-card/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Audio ping utility
const playPing = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

const useTrackingCounters = () => {
  // Start at zero as requested
  const BASE_VISITORS = 0;
  const BASE_CLICKS = 0;
  const BASE_SHARES = 0;

  const [stats, setStats] = useState({
    visitors: BASE_VISITORS,
    clicks: BASE_CLICKS,
    shares: BASE_SHARES
  });

  useEffect(() => {
    // 1. Visitor Tracking
    let localVisitors = parseInt(localStorage.getItem('track_visitors') || '0');
    const hasVisitedSession = sessionStorage.getItem('session_visited');
    
    if (!hasVisitedSession) {
      localVisitors += 1;
      localStorage.setItem('track_visitors', localVisitors.toString());
      sessionStorage.setItem('session_visited', 'true');
    }

    // 2. Click Tracking
    let localClicks = parseInt(localStorage.getItem('track_clicks') || '0');
    
    // 3. Share Tracking
    let localShares = parseInt(localStorage.getItem('track_shares') || '0');

    setStats({
      visitors: BASE_VISITORS + localVisitors,
      clicks: BASE_CLICKS + localClicks,
      shares: BASE_SHARES + localShares
    });

    // Global Click Listener for tracking link/button clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        localClicks += 1;
        localStorage.setItem('track_clicks', localClicks.toString());
        setStats(prev => ({ ...prev, clicks: BASE_CLICKS + localClicks }));
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const trackShare = () => {
    const currentShares = parseInt(localStorage.getItem('track_shares') || '0');
    const newShares = currentShares + 1;
    localStorage.setItem('track_shares', newShares.toString());
    setStats(prev => ({ ...prev, shares: BASE_SHARES + newShares }));
    playPing();
  };

  return { stats, trackShare };
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const increment = value / totalFrames;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('en-US')}</span>;
};

const ParticipantsBoard = ({ shares, visitors }: { shares: number, visitors: number }) => {
  // If visitors < 800, show a locked state
  if (visitors < 800) {
    return (
      <div className="mt-12 p-8 border border-amber-500/20 rounded-2xl bg-[#0B0B14]/50 text-center relative overflow-hidden w-full">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-10 flex flex-col items-center justify-center">
          <Lock className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لوحة المشاركين (مقفلة)</h3>
          <p className="text-slate-400">تُفتح اللوحة عند الوصول إلى 800 زائر. (الحالي: {visitors})</p>
        </div>
        {/* Blurred mock content behind */}
        <div className="opacity-30 blur-sm">
          <div className="flex gap-4 justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state
  const mockParticipants = [
    { id: 1, name: 'سارة م.', shares: 45, early: true },
    { id: 2, name: 'أحمد خ.', shares: 32, early: true },
    { id: 3, name: 'محمد ع.', shares: 28, early: true },
    { id: 4, name: 'نورة س.', shares: 15, early: false },
    { id: 5, name: 'أنت', shares: shares > 0 ? shares : 0, early: shares > 0, isUser: true },
  ].filter(p => p.shares > 0).sort((a, b) => b.shares - a.shares);

  return (
    <div className="mt-12 p-8 border border-amber-500/30 rounded-2xl bg-gradient-to-b from-[#1A1A2E] to-[#0B0B14] w-full text-right">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-500" />
          لوحة الشرف للمشاركين
        </h3>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-medium">
          مرئية للجميع
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockParticipants.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border ${p.isUser ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-[#0B0B14]'}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-900 flex items-center justify-center text-white font-bold text-lg">
                {p.name.charAt(0)}
              </div>
              {p.early && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0B0B14]" title="مشارك مبكر">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold flex items-center gap-2">
                {p.name}
                {p.isUser && <span className="text-xs text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">أنت</span>}
              </h4>
              <p className="text-slate-400 text-sm">{p.shares} مشاركة</p>
            </div>
            <div className="text-2xl font-black text-slate-700">
              #{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ShareAndGrowSection = ({ stats, trackShare }: { stats: any, trackShare: () => void }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const shareCount = stats.shares;

  const handleShare = (platform: string) => {
    setIsAnimating(true);
    trackShare();
    setTimeout(() => setIsAnimating(false), 500);

    const userId = Math.random().toString(36).substring(7);
    const url = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
    const text = "الفكرة تكبر كلما شاركتها… اكتشف هذه المنظومة الرائعة!";

    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    setShowOptions(false);
  };

  const getMilestone = () => {
    if (shareCount < 1000) return { current: 1000, reward: "سحب على جائزة بقيمة 100 دولار", icon: Gift };
    return { current: 10000, reward: "إطلاق ميزة جديدة حصريًا للمشاركين", icon: Sparkles };
  };

  const milestone = getMilestone();
  const prevMilestone = shareCount < 1000 ? 0 : 1000;
  const progress = Math.min(((shareCount - prevMilestone) / (milestone.current - prevMilestone)) * 100, 100);
  const dropsRemaining = 200 - (shareCount % 200);

  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-[#0B0B14] to-[#1A1A2E]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 rounded-2xl mb-2 text-amber-500">
            <Share2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            شارك وكبّر الأثر
          </h2>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300 font-bold">
            الفكرة تكبر كلما شاركتها… اضغط الآن لتكون جزءًا من النمو.
          </p>
        </div>

        {/* Live Counter */}
        <div className={`flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/10 w-full max-w-md relative overflow-hidden ${isAnimating ? 'animate-shake' : ''}`}>
          <div className={`absolute inset-0 bg-amber-500/20 blur-xl rounded-full transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}></div>
          <p className="text-slate-400 mb-2 font-medium relative z-10">إجمالي المشاركات والتأثير</p>
          <div className={`text-6xl md:text-7xl font-black text-white tracking-tight transition-transform duration-300 relative z-10 ${isAnimating ? 'scale-110 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : ''}`}>
            <AnimatedCounter value={shareCount} />
          </div>
          <p className="text-amber-500 mt-4 font-bold animate-pulse relative z-10">
            كل مشاركة = تذكرة دخول للسحب!
          </p>
        </div>

        {/* Milestone Progress */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-400">الهدف القادم: {milestone.current.toLocaleString('en-US')}</span>
            <span className="text-amber-500 flex items-center gap-1">
              <milestone.icon className="w-4 h-4" /> {milestone.reward}
            </span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </motion.div>
          </div>
          <p className="text-slate-500 text-xs">
            باقي {milestone.current - shareCount} مشاركة للوصول للهدف. 🎁 مكافأة عشوائية قادمة بعد {dropsRemaining} مشاركة!
          </p>
        </div>

        {/* Share Button & Options */}
        <div className="relative w-full max-w-md">
          {!showOptions ? (
            <button 
              onClick={() => setShowOptions(true)}
              className="w-full group relative bg-amber-500 hover:bg-amber-500/90 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span>انشر الرابط الآن</span>
              <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              <button onClick={() => handleShare('whatsapp')} className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-4 rounded-xl transition-colors">
                <MessageSquare className="w-5 h-5" /> واتساب
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-bold py-4 rounded-xl transition-colors">
                <Twitter className="w-5 h-5" /> تويتر
              </button>
              <button onClick={() => handleShare('facebook')} className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-4 rounded-xl transition-colors">
                <Facebook className="w-5 h-5" /> فيسبوك
              </button>
              <button onClick={() => handleShare('telegram')} className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-4 rounded-xl transition-colors">
                <Send className="w-5 h-5" /> تليجرام
              </button>
            </motion.div>
          )}
        </div>

        {/* Participants Board */}
        <ParticipantsBoard shares={shareCount} visitors={stats.visitors} />
      </div>
    </Card>
  );
};

export default function App() {
  const { stats, trackShare } = useTrackingCounters();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شكراً لتواصلك! سيتم الرد عليك قريباً.');
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-slate-200 selection:bg-amber-500/30 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Logo */}
      <header className="pt-10 pb-6 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl"
        >
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
          <span className="text-lg font-bold text-white tracking-wide">سوق الكتاب</span>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-24 space-y-12">
        
        {/* Hero Section */}
        <div className="relative pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="mb-12 relative inline-block w-full max-w-4xl group">
              {/* Animated Glow Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 via-amber-400/20 to-amber-600/20 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative aspect-[4/5] md:aspect-video rounded-[2rem] p-[2px] bg-gradient-to-b from-amber-400/50 via-amber-600/30 to-transparent shadow-2xl overflow-hidden">
                <div className="w-full h-full rounded-[1.9rem] bg-[#050505] flex items-center justify-center overflow-hidden border-[6px] border-[#0a0a0a]">
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="/IMG_4658.jpg" 
                    alt="Sooq Alketab Personalities" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                  {/* Pixel-Perfect Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center text-center pointer-events-none select-none">
                    {/* 1. الجملة الأولى (20%) */}
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute top-[20%] text-slate-300/80 text-lg md:text-2xl font-medium tracking-wide"
                    >
                      ليست مجرد فكرة…
                    </motion.div>

                    {/* 2. العنوان الرئيسي (35% & 50%) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.8 }}
                      className="absolute top-[35%] text-5xl md:text-7xl font-black text-amber-500/90 tracking-tighter"
                    >
                      بل منظومة
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                      className="absolute top-[50%] text-4xl md:text-6xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                    >
                      تتحرك
                    </motion.div>

                    {/* 3. الجملة السفلية (75%) */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0, duration: 1 }}
                      className="absolute top-[75%] w-full px-6"
                    >
                      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-sm md:text-lg font-bold">
                        <span className="text-slate-400/60 font-light">من</span>
                        <span className="text-amber-500">المعرفة</span>
                        <span className="text-slate-400/60 font-light">إلى</span>
                        <span className="text-emerald-500">التقنية</span>
                        <span className="text-slate-400/60 font-light">إلى</span>
                        <span className="text-amber-500">الأثر الحقيقي</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-amber-500/50 mb-6 tracking-tight">
                من أنا
              </h1>
              
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
                <p className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm md:text-base">
                  طالب هندسة برمجيات وحواسيب
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-white/80 font-medium text-lg">
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">صانع حلول رقمية</span>
                  <span className="text-amber-500/50">•</span>
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">مطور منظومات متكاملة</span>
                </div>
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-4 text-center">
                  أجمع بين العقل التقني، والحس الإبداعي، والفهم الإنساني.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Slogan Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent border border-amber-500/20 p-8 md:p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              أبني ما يمكنه أن <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">يستمر…</span>
              <br /> لا ما يتوقف.
            </h2>
          </div>
        </motion.div>

        {/* What I Do Section */}
        <Card>
          <SectionTitle icon={Briefcase}>ماذا أفعل؟</SectionTitle>
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 leading-relaxed mb-4">
                  أجمع بين دقة الهندسة وذكاء التسويق،<br/>
                  لأحوّل الأفكار إلى مشاريع حقيقية،<br/>
                  والمشاريع إلى علامات ناجحة.
                </p>
                <p className="text-amber-500 font-medium mt-4">
                  عملي لا يعتمد على الحظ… بل على منهجية واضحة ونتائج قابلة للقياس.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <ul className="grid grid-cols-1 gap-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> بناء وتطوير المواقع والأنظمة</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> تصميم الهويات والشعارات</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> تصوير المنتجات باحترافية</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> إدارة الصفحات وصناعة المحتوى</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">منهجية العمل</h3>
              <div className="grid gap-6">
                {[
                  { title: 'تحليل عميق', desc: 'فهم دقيق للمتطلبات والجمهور قبل البدء' },
                  { title: 'تنفيذ دقيق', desc: 'جودة عالية في التفاصيل التقنية والبصرية' },
                  { title: 'تطوير مستمر', desc: 'تحسينات مبنية على البيانات والنتائج' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-white">{item.title}: </span>
                      <span className="text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Project Lifecycle Section */}
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-colors duration-700" />
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">نستلم مشروعك من الصفر…</h2>
              <p className="text-amber-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                ونبنيه خطوة بخطوة حتى يصبح منظومة كاملة تتحرك بتناغم.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "بناء وتطوير المواقع والأنظمة",
                "تصميم الهويات والشعارات",
                "إدارة الصفحات وصناعة المحتوى",
                "تصوير المنتجات باحترافية",
                "تصميم المحتوى المرئي الإبداعي",
                "تخطيط المحتوى وفق بيانات حقيقية",
                "نشر محتوى يحقق تفاعلًا حقيقيًا",
                "تطوير مستمر بعد التسليم",
                "دعم دائم + تحسينات مبنية على النتائج",
                "حلول مخصصة لكل عميل (لا قوالب)",
                "برامج تدريبية لفهم وإدارة المحتوى"
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-slate-300 font-medium text-sm md:text-base group-hover/item:text-white transition-colors">
                    {service}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Why Us Section */}
        <Card>
          <SectionTitle icon={ShieldCheck}>سر تميزنا</SectionTitle>
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-8 rounded-3xl border border-amber-500/20">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              نحن لا نقدّم خدمات منفصلة… بل حلولًا متكاملة.
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed text-center mb-8 max-w-3xl mx-auto">
              نملك خبرة عملية في الأعمال والمبيعات، وخبرة تقنية في البرمجيات، وهذا ما يجعل نتائجنا تتفوق على <span className="text-amber-500 font-bold">99%</span> من السوق.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-lg">
              <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-white font-medium text-lg leading-relaxed text-center md:text-right">
                نحن لا نروّج فقط، بل نبني منظومات تجعل الترويج أسهل… وربما غير ضروري.
              </p>
            </div>
          </div>
        </Card>

        {/* Ecosystem Section */}
        <div className="space-y-8">
          <SectionTitle icon={Layers}>منظومة سوق الكتاب</SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Sooq Alketab (The Mother Page) */}
            <div className="relative flex flex-col h-full bg-[#0B0B14] border border-white/5 rounded-[2rem] p-8 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(217,119,6,0.2)] hover:border-amber-600/30 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-900/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] relative group/img">
                  <img src="/Images/Sooqalketab.jpg" alt="Sooq Alketab" className="w-full h-full object-cover object-top transition-transform duration-700 scale-[1.15] group-hover/img:scale-[1.25]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-transparent opacity-60" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-amber-500 mb-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8" strokeWidth={1.2} />
                    <h3 className="text-2xl font-bold text-white tracking-tight">العمق والثقافة</h3>
                  </div>
                  <span className="text-amber-500/60 text-xs font-bold tracking-widest uppercase">Sooq Alketab</span>
                </div>
                <p className="text-slate-300 text-center mb-4 text-sm font-bold leading-relaxed px-2">
                  بوابتك لعالم النشر وصناعة المحتوى الأدبي.
                </p>
                <p className="text-slate-400 text-center mb-8 text-xs leading-relaxed px-4 opacity-80">
                  نرافقك في رحلة تحويل الفكرة إلى كتاب مطبوع، من خلال خدمات تحريرية وتصميمية متكاملة تضمن جودة المحتوى وجاذبية المظهر.
                </p>
                
                <div className="space-y-8 flex-grow">
                  {/* Audience */}
                  <div>
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-colors">
                      <span className="text-slate-300 text-sm font-medium">الكتّاب الطموحون – القرّاء النهمون – المؤسسات الثقافية</span>
                      <Users className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={1.2} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-2">
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-3">
                      {[
                        { title: 'تطوير الفكرة المحورية', icon: Lightbulb },
                        { title: 'مراجعة النصوص وتحريرها', icon: FileText },
                        { title: 'التدقيق اللغوي', icon: CheckSquare },
                        { title: 'تصميم الغلاف والهوية البصرية', icon: Palette },
                        { title: 'خدمات الطباعة والنشر', icon: Printer },
                        { title: 'دعم المؤلفين والكتّاب', icon: Users },
                        { title: 'التوزيع الرقمي والورقي', icon: Globe },
                        { title: 'حماية حقوق الملكية', icon: ShieldCheck }
                      ].map((service, i) => (
                        <div key={i} className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                          <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">{service.title}</span>
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500/20 group-hover/item:scale-110 transition-all border border-amber-500/10">
                            <service.icon className="w-5 h-5 text-amber-500" strokeWidth={1.2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                  <a href="https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-amber-500/10 hover:border-amber-600/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-amber-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">فيسبوك</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-amber-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                  <a href="https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-amber-500/10 hover:border-amber-600/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-amber-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">إنستجرام</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-amber-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                  <a href="https://chat.whatsapp.com/Hoo7gZxFvcSAKJMJ6d5tAv" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-amber-500/10 hover:border-amber-600/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-amber-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">واتساب</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-amber-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                </div>
              </div>
            </div>

            {/* Sooq Alketab Plus */}
            <div className="relative flex flex-col h-full bg-[#0B0B14] border border-white/5 rounded-[2rem] p-8 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.2)] hover:border-yellow-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/10 via-yellow-600/5 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] relative group/img">
                  <img src="/Images/plus.jpg" alt="Sooq Alketab Plus" className="w-full h-full object-cover object-top transition-transform duration-700 scale-[1.15] group-hover/img:scale-[1.25]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-transparent opacity-60" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-yellow-500 mb-6">
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-8 h-8" strokeWidth={1.2} />
                    <h3 className="text-2xl font-bold text-white tracking-tight">الأعمال والاحتراف</h3>
                  </div>
                  <span className="text-yellow-500/60 text-xs font-bold tracking-widest uppercase">Sooq Alketab Plus</span>
                </div>
                <p className="text-slate-300 text-center mb-4 text-sm font-bold leading-relaxed px-2">
                  هنا نأخذ مشروعك إلى مرحلة الظهور والانتشار.
                </p>
                <p className="text-slate-400 text-center mb-8 text-xs leading-relaxed px-4 opacity-80">
                  نصنع محتوى يتحدث بلغة جمهورك، ونبني استراتيجيات تسويقية مبنية على بيانات حقيقية لضمان وصول رسالتك وتحقيق أهدافك.
                </p>

                <div className="space-y-8 flex-grow">
                  {/* Audience */}
                  <div>
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-yellow-500/20 transition-colors">
                      <span className="text-slate-300 text-sm font-medium">أصحاب المشاريع – المسوقون – الباحثون عن التميز الرقمي</span>
                      <Users className="w-5 h-5 text-yellow-500 shrink-0" strokeWidth={1.2} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-2">
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-3">
                      {[
                        { title: 'إدارة الصفحات باحترافية', icon: Layout },
                        { title: 'تصميم المواقع', icon: Smartphone },
                        { title: 'حملات إعلانية دقيقة', icon: Target },
                        { title: 'عرض منتجات باحتراف', icon: Eye },
                        { title: 'تخطيط فرص إعلانية', icon: TrendingUp },
                        { title: 'صناعة محتوى مرئي إبداعي', icon: Video },
                        { title: 'استراتيجية محتوى مبنية على البيانات', icon: BarChart2 },
                        { title: 'تطوير مستمر بعد التسليم', icon: Zap }
                      ].map((service, i) => (
                        <div key={i} className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                          <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">{service.title}</span>
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-yellow-500/20 group-hover/item:scale-110 transition-all border border-yellow-500/10">
                            <service.icon className="w-5 h-5 text-yellow-500" strokeWidth={1.2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                  <a href="https://www.facebook.com/share/1D4H22L7eH/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-yellow-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">فيسبوك بلس</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-yellow-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                  <a href="https://www.instagram.com/sooqalketab_plus?igsh=MWQyZ3Iwd3ltbGs1ZQ==" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-yellow-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">إنستجرام بلس</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-yellow-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                  <a href="https://wa.me/966551628760" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-yellow-500" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">واتساب بلس</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-yellow-500 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                </div>
              </div>
            </div>

            {/* Sooq Alketab Technology */}
            <div className="relative flex flex-col h-full bg-[#0B0B14] border border-white/5 rounded-[2rem] p-8 group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] relative group/img">
                  <img src="/IMG_4564.jpg" alt="Sooq Alketab Tech" className="w-full h-full object-cover object-top transition-transform duration-700 scale-[1.15] group-hover/img:scale-[1.25]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B14] via-transparent to-transparent opacity-60" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-emerald-400 mb-6">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-8 h-8" strokeWidth={1.2} />
                    <h3 className="text-2xl font-bold text-white tracking-tight">التقنية والحلول الذكية</h3>
                  </div>
                  <span className="text-emerald-400/60 text-xs font-bold tracking-widest uppercase">Sooq Alketab Tech</span>
                </div>
                <p className="text-slate-300 text-center mb-4 text-sm font-bold leading-relaxed px-2">
                  نوفر لك أفضل الإكسسوارات والحلول التقنية.
                </p>
                <p className="text-slate-400 text-center mb-8 text-xs leading-relaxed px-4 opacity-80">
                  شواحن أصلية، سماعات بجودة عالية، كفرات وحماية متكاملة، مع خدمة شحن سريعة وموثوقة لجميع المحافظات.
                </p>

                <div className="space-y-8 flex-grow">
                  {/* Audience */}
                  <div>
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                      <span className="text-slate-300 text-sm font-medium">مستخدمو الهواتف – عشاق التقنية – الباحثون عن الجودة</span>
                      <Users className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={1.2} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-2">
                    <h4 className="font-bold text-white mb-4 text-right text-xs uppercase tracking-widest opacity-60">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">شواحن أصلية وسريعة</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Zap className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">سماعات ذات جودة عالية</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Headphones className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">كفرات وحماية متكاملة</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Shield className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">شحن سريع للمحافظات</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Truck className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">صيانة الأجهزة الذكية</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Smartphone className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 text-right group/item p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <span className="text-slate-300 text-sm font-medium group-hover/item:text-white transition-colors">استشارات تقنية متخصصة</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all border border-emerald-500/10">
                          <Brain className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                  <a href="https://www.facebook.com/SooqAlketabtechnology" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">فيسبوك</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-emerald-400 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                  <a href="https://wa.me/message/F7R7RTGBN4BEP1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group/link">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-emerald-400" strokeWidth={1.2} />
                      <span className="text-white font-medium text-sm">واتساب</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover/link:text-emerald-400 group-hover/link:-translate-x-1 transition-all" strokeWidth={1.2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-12 py-12">
          {/* Hook Before */}
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">
              “الأثر الحقيقي… يُقاس بما يتحرك، لا بما يُقال.”
            </p>
          </div>

          {/* Intro */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <BarChart2 className="w-8 h-8 text-amber-500" />
              الأرقام التي تصنع الرحلة
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-2 text-lg">
              <p>الأرقام هنا ليست للعرض…</p>
              <p>هي انعكاس لحركة الناس داخل المنظومة، ودليل على أن الفكرة لا تعيش وحدها، بل تتحرك مع كل من يمر بها.</p>
              <p>كل رقم يمثل تفاعلًا… وكل تفاعل خطوة جديدة في بناء مشروع يكبر يومًا بعد يوم.</p>
            </div>
          </div>

          {/* Counters */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center text-center p-8 bg-[#0B0B14] border-[#1A1A2E] hover:border-amber-500/50 transition-colors duration-300">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">عدد الزائرين</h3>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
                <AnimatedCounter value={stats.visitors} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                كل دخول إلى الموقع يضيف نقطة جديدة.<br/>
                هذا الرقم يعكس حجم الاهتمام… وبداية كل علاقة.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-8 bg-[#0B0B14] border-[#1A1A2E] hover:border-amber-500/50 transition-colors duration-300">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                <LinkIcon className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">عدد الضغطات على الروابط</h3>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
                <AnimatedCounter value={stats.clicks} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                كل ضغطة على أي رابط داخل الموقع — أي صفحة، أي قسم — تزيد العداد واحدًا.<br/>
                هذا الرقم يعكس الفضول… والرغبة في معرفة المزيد.
              </p>
            </Card>
          </div>

          {/* Share and Grow Section */}
          <ShareAndGrowSection stats={stats} trackShare={trackShare} />

          {/* Outro */}
          <div className="text-center space-y-8 max-w-3xl mx-auto pt-8">
            <p className="text-slate-300 leading-relaxed text-lg">
              هذه الأرقام ليست نهاية الطريق…<br/>
              بل إشارات على أننا نسير في الاتجاه الصحيح،<br/>
              وأن المنظومة تتحرك… وتتوسع… وتكبر مع كل خطوة.
            </p>
            
            {/* Hook After */}
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">
              “حين يتحرك الناس… تتحرك الفكرة.”
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <Card id="contact">
          <SectionTitle icon={Mail}>تواصل معي</SectionTitle>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-slate-400 text-lg">
                هل لديك فكرة أو مشروع؟<br/>
                يسعدني دائمًا التعاون والعمل على شيء جديد.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span>sooqalketab@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span>00966551628760</span>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/SooqAlketabtechnology" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-amber-500/20 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-amber-500/20 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="https://wa.me/message/F7R7RTGBN4BEP1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-amber-500/20 transition-colors"><MessageSquare className="w-5 h-5" /></a>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="الاسم الكامل"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-colors"
                required
              />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-colors"
                required
              />
              <textarea 
                placeholder="رسالتك هنا..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-colors resize-none"
                required
              ></textarea>
              <button className="w-full bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-500/90 transition-all flex items-center justify-center gap-2">
                إرسال الرسالة <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </Card>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} سوق الكتاب (Sooq Alketab). جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
