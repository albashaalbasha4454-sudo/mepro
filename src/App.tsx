/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { 
  Code,
  Rocket,
  Zap, 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Send,
  ArrowLeft,
  Palette,
  BarChart3,
  PenTool,
  Award,
  ShieldCheck,
  Globe,
  BarChart2,
  Eye,
  Link as LinkIcon,
  Share2,
  Headphones,
  Laptop,
  Camera,
  Search,
  RefreshCw,
  GraduationCap,
  ArrowUp,
  Activity,
  MousePointer2
} from 'lucide-react';
import { motion } from 'motion/react';


const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="mb-20 flex flex-col items-center text-center space-y-8">
    <div className="flex items-center justify-center gap-8">
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 80, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" 
      />
      {Icon && (
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-4 bg-amber-500/5 rounded-3xl border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)] backdrop-blur-2xl"
        >
          <Icon className="w-7 h-7 text-amber-500" strokeWidth={1} />
        </motion.div>
      )}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 80, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="h-[1px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" 
      />
    </div>
    <div className="space-y-4">
      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
        {children}
      </h2>
      <div className="flex justify-center">
        <div className="h-1 w-12 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
      </div>
    </div>
  </div>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    whileHover={{ y: -8 }}
    className={`bg-[#0A0A0F]/60 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.8)] hover:border-amber-500/10 transition-all duration-700 group ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const useTrackingCounters = () => {
  const [stats, setStats] = useState({
    visitors: 12450,
    clicks: 8720,
    shares: 1050
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (data && !error) {
          setStats({
            visitors: data.visitors || 12450,
            clicks: data.clicks || 8720,
            shares: data.shares || 1050
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Set up realtime subscription if supabase is available
    if (supabase) {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'stats',
            filter: 'id=eq.1'
          },
          (payload) => {
            if (payload.new) {
              setStats({
                visitors: payload.new.visitors || stats.visitors,
                clicks: payload.new.clicks || stats.clicks,
                shares: payload.new.shares || stats.shares
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    }
  }, []);

  // Increment visitors on load
  useEffect(() => {
    const incrementVisitor = async () => {
      if (!supabase) return;
      
      const hasVisited = localStorage.getItem('has_visited');
      if (!hasVisited) {
        try {
          await supabase.rpc('increment_visitors');
          localStorage.setItem('has_visited', 'true');
        } catch (err) {
          console.error('Error incrementing visitor:', err);
        }
      }
    };
    
    incrementVisitor();
  }, []);

  const trackClick = useCallback(async () => {
    setStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    if (supabase) {
      try {
        await supabase.rpc('increment_clicks');
      } catch (err) {
        console.error('Error tracking click:', err);
      }
    }
  }, []);

  const trackShare = useCallback(async () => {
    setStats(prev => ({ ...prev, shares: prev.shares + 1 }));
    if (supabase) {
      try {
        await supabase.rpc('increment_shares');
      } catch (err) {
        console.error('Error tracking share:', err);
      }
    }
  }, []);

  return { stats, trackShare, trackClick, isLoading };
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 2000;
    const increment = end / (totalDuration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('en-US')}</span>;
};

const ShareAndGrowSection = ({ stats, trackShare }: { stats: any, trackShare: () => void }) => {
  const shareLinks = [
    { label: 'واتساب بلس', icon: MessageSquare, url: 'https://wa.me/message/LVPNQNYJE3PLD1' },
    { label: 'فيسبوك', icon: Facebook, url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) },
    { label: 'إنستجرام', icon: Instagram, url: 'https://www.instagram.com/sooq_alketab' },
    { label: 'تلجرام', icon: Send, url: 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('اكتشف منظومة سوق الكتاب - العمق والثقافة') },
  ];

  return (
    <div className="mt-20 space-y-12">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Stats Card */}
        <div className="bg-[#0B0B14] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">إحصائيات المنظومة</h3>
                <p className="text-slate-500 text-sm">تحديث مباشر لكل تفاعل</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'زائر', value: stats.visitors, icon: Eye, color: 'text-blue-400' },
                { label: 'تفاعل', value: stats.clicks, icon: MousePointer2, color: 'text-emerald-400' },
                { label: 'مشاركة', value: stats.shares, icon: Share2, color: 'text-amber-400' },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <stat.icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className={`text-3xl font-black ${stat.color}`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Share Card */}
        <div className="bg-amber-500 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
          
          <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-black leading-tight">
                كن جزءاً من الأثر<br/>وساهم في نمو المنظومة
              </h3>
              <p className="text-black/60 font-medium max-w-sm">
                كل مشاركة منك توسع دائرة المعرفة، وتساعد في إيصال المنظومة لمن يحتاجها. شارك الآن وكن شريكاً في هذا النجاح.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {shareLinks.map((link, i) => (
                <SocialLink 
                  key={i} 
                  href={link.url} 
                  label={link.label} 
                  icon={link.icon} 
                  colorClass="amber" 
                  variant="light"
                  onClick={trackShare}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ 
  href, 
  label, 
  icon: Icon, 
  colorClass = "amber", 
  onClick,
  variant = "dark"
}: { 
  href: string, 
  label: string, 
  icon: any, 
  colorClass?: "amber" | "yellow" | "emerald",
  onClick?: () => void,
  variant?: "dark" | "light"
}) => {
  const themes = {
    amber: {
      hover: variant === "dark" ? "hover:bg-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]" : "hover:bg-black/10 hover:border-black/20",
      icon: variant === "dark" ? "text-amber-500" : "text-black",
      bg: variant === "dark" ? "bg-amber-500/10" : "bg-black/10",
      arrow: variant === "dark" ? "group-hover/link:text-amber-500" : "group-hover/link:text-black",
      text: variant === "dark" ? "text-white" : "text-black"
    },
    yellow: {
      hover: "hover:bg-yellow-500/20 hover:border-yellow-500/40 hover:shadow-[0_0_30_rgba(234,179,8,0.2)]",
      icon: "text-yellow-500",
      bg: "bg-yellow-500/10",
      arrow: "group-hover/link:text-yellow-500",
      text: "text-white"
    },
    emerald: {
      hover: "hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_30_rgba(16,185,129,0.2)]",
      icon: "text-emerald-500",
      bg: "bg-emerald-500/10",
      arrow: "group-hover/link:text-emerald-500",
      text: "text-white"
    }
  };

  const theme = themes[colorClass];

  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between p-6 rounded-[2rem] ${variant === "dark" ? "bg-white/[0.03] border-white/5" : "bg-black/[0.03] border-black/10"} border backdrop-blur-xl ${theme.hover} transition-all duration-500 group/link w-full shadow-2xl`}
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${theme.bg} flex items-center justify-center shrink-0 shadow-inner transition-all duration-700 group-hover/link:scale-110 group-hover/link:rotate-3`}>
          <Icon className={`w-7 h-7 ${theme.icon}`} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-start">
          <span className={`${theme.text} font-black text-lg tracking-tight transition-colors duration-500`}>{label}</span>
          <span className={`${variant === "dark" ? "text-slate-500" : "text-black/40"} text-xs font-medium uppercase tracking-widest mt-0.5`}>انقر للمتابعة</span>
        </div>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${variant === "dark" ? "border-white/5 bg-white/5" : "border-black/5 bg-black/5"} group-hover/link:border-current transition-all duration-500`}>
        <ArrowLeft className={`w-5 h-5 ${variant === "dark" ? "text-slate-500" : "text-black/40"} ${theme.arrow} group-hover/link:-translate-x-1 transition-all duration-500`} strokeWidth={2.5} />
      </div>
    </motion.a>
  );
};

export default function App() {
  const { stats, trackShare, trackClick, isLoading } = useTrackingCounters();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شكراً لتواصلك! سيتم الرد عليك قريباً.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black" dir="rtl" onClick={trackClick}>
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[140px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-24 space-y-32">
        
        {/* Hero Section - "من أنا" Focus */}
        <div className="relative min-h-screen flex flex-col items-center justify-center pt-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[80%] h-[80%] bg-amber-500/5 rounded-full blur-[160px] animate-pulse" />
          </motion.div>

          <div className="relative z-10 text-center space-y-16 w-full">
            {/* Main Visual Anchor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative inline-block group"
            >
              <div className="absolute -inset-12 bg-amber-500/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative aspect-[4/5] md:aspect-video w-full max-w-5xl mx-auto rounded-[4rem] p-[1px] bg-gradient-to-b from-amber-500/40 via-white/10 to-transparent shadow-[0_50px_120px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="w-full h-full rounded-[3.95rem] bg-[#050505] flex items-center justify-center overflow-hidden border-[20px] border-[#080808]">
                  <motion.img 
                    initial={{ scale: 1.6, filter: 'blur(20px)', opacity: 0 }}
                    animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                    transition={{ 
                      duration: 2.5, 
                      ease: [0.22, 1, 0.36, 1],
                      opacity: { duration: 1.5 }
                    }}
                    src="/IMG_4658.jpg" 
                    alt="Sooq Alketab Personalities" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                    {/* Pixel-Perfect Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center text-center pointer-events-none select-none">
                      {/* 1. الجملة الأولى (22%) */}
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute top-[22%] text-slate-200/80 text-lg md:text-3xl font-black uppercase tracking-[0.3em] drop-shadow-lg"
                      >
                        ليست مجرد فكرة...
                      </motion.div>
  
                      {/* 2. العنوان الرئيسي (35% & 50%) */}
                      <div className="absolute top-[30%] flex flex-col items-center">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0, duration: 0.8 }}
                          className="text-5xl md:text-7xl font-black text-white/90 tracking-tighter leading-none"
                        >
                          بل منظومة
                        </motion.div>
  
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5, duration: 0.8 }}
                          className="text-5xl md:text-8xl font-black text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] leading-none mt-2"
                        >
                          تتحرك
                        </motion.div>
                      </div>
  
                      {/* 3. الجملة السفلية (75%) */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 1 }}
                        className="absolute bottom-[12%] w-full px-6"
                      >
                        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-sm md:text-2xl font-black uppercase tracking-widest bg-black/20 backdrop-blur-sm py-4 rounded-full max-w-4xl mx-auto border border-white/5 shadow-2xl">
                          <span className="text-slate-300">من</span>
                          <span className="text-white border-b-4 border-amber-500 pb-1 px-2">المعرفة</span>
                          <span className="text-slate-300">إلى</span>
                          <span className="text-white border-b-4 border-emerald-500 pb-1 px-2">التقنية</span>
                          <span className="text-slate-300">إلى</span>
                          <span className="text-white border-b-4 border-amber-500 pb-1 px-2">الأثر الحقيقي</span>
                        </div>
                      </motion.div>
                    </div>
                </div>
              </div>
            </motion.div>

            {/* Identity Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                  Sooq Alketab
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 bg-amber-500/30" />
                  <p className="text-amber-500 font-black text-2xl md:text-3xl tracking-[0.4em] uppercase">
                    العمق والثقافة
                  </p>
                  <div className="h-[1px] w-12 bg-amber-500/30" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="px-10 py-4 rounded-full bg-amber-500/5 border border-amber-500/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                >
                  <p className="text-amber-500 font-black tracking-[0.1em] text-xl md:text-2xl">
                    طالب هندسة برمجيات وحواسيب
                  </p>
                </motion.div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <span className="px-8 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300 font-bold text-xl hover:bg-white/5 hover:border-white/10 transition-all duration-500">صانع حلول رقمية</span>
                  <span className="px-8 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300 font-bold text-xl hover:bg-white/5 hover:border-white/10 transition-all duration-500">مطور منظومات متكاملة</span>
                </div>

                <p className="text-slate-300 text-2xl md:text-4xl max-w-4xl mx-auto leading-relaxed mt-12 font-medium italic">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    "أجمع بين العقل التقني، والحس الإبداعي، والفهم الإنساني."
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slogan Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-10 md:p-16 text-center group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-amber-600/20 transition-colors duration-700"></div>
          <div className="relative z-10 space-y-8">
            <motion.h2 
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              أبني ما يمكنه أن <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 animate-gradient-x">يستمر...</span>
              <br /> <span className="opacity-50">لا ما يتوقف.</span>
            </motion.h2>
          </div>
        </motion.div>

        {/* What I Do Section */}
        <section id="what-i-do" className="relative">
          <SectionTitle icon={Zap}>ماذا أفعل؟</SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                <Search className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white">التحليل العميق</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  دراسة الاحتياجات بدقة هندسية، وتحويل التحديات إلى فرص تقنية ملموسة.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col items-center text-center space-y-8 border-amber-500/20 bg-amber-500/[0.02]">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <Code className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white">التنفيذ المتقن</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  بناء أنظمة برمجية قوية، قابلة للتوسع، وتتمتع بتجربة مستخدم استثنائية.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                <Rocket className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white">التطوير المستمر</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  مرافقة المشاريع بعد الإطلاق لضمان الأداء الأمثل والتطور الدائم.
                </p>
              </div>
            </Card>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center"
          >
            <p className="text-2xl md:text-3xl text-slate-300 font-medium italic leading-relaxed">
              "لا أقدم مجرد خدمات، بل أبني <span className="text-amber-500 font-black">شراكات تقنية</span> تهدف للنمو والاستدامة."
            </p>
          </motion.div>
        </section>

        {/* Project Lifecycle Section */}
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -ml-48 -mt-48" />
          
          <div className="relative z-10">
            <div className="text-center mb-16 space-y-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-white tracking-tight"
              >
                نستلم مشروعك من <span className="text-amber-500">الصفر...</span>
              </motion.h2>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                ونبنيه خطوة بخطوة حتى يصبح منظومة كاملة تتحرك بتناغم.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "بناء وتطوير المواقع والأنظمة", icon: Laptop },
                { title: "تصميم الهويات والشعارات", icon: Palette },
                { title: "إدارة الصفحات وصناعة المحتوى", icon: Share2 },
                { title: "تصوير المنتجات باحترافية", icon: Camera },
                { title: "تصميم المحتوى المرئي الإبداعي", icon: PenTool },
                { title: "تخطيط المحتوى وفق بيانات حقيقية", icon: BarChart3 },
                { title: "نشر محتوى يحقق تفاعلًا حقيقيًا", icon: MessageSquare },
                { title: "تطوير مستمر بعد التسليم", icon: RefreshCw },
                { title: "دعم دائم + تحسينات مبنية على النتائج", icon: Headphones },
                { title: "حلول مخصصة لكل عميل (لا قوالب)", icon: ShieldCheck },
                { title: "برامج تدريبية لفهم وإدارة المحتوى", icon: GraduationCap }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group/item cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500/20 transition-colors shadow-lg">
                    <service.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-slate-200 font-bold text-sm md:text-base group-hover/item:text-white transition-colors leading-tight">
                    {service.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Why Us Section */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          <SectionTitle icon={ShieldCheck}>سر تميزنا</SectionTitle>
          <div className="bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-10 md:p-16 rounded-[3rem] border border-amber-500/20 relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-8 text-center leading-tight">
              نحن لا نقدّم خدمات منفصلة... <br/> <span className="text-amber-500">بل حلولًا متكاملة.</span>
            </h3>
            <p className="text-slate-300 text-xl leading-relaxed text-center mb-12 max-w-4xl mx-auto font-medium">
              نملك خبرة عملية في الأعمال والمبيعات، وخبرة تقنية في البرمجيات، وهذا ما يجعل نتائجنا تتفوق على <span className="text-amber-500 font-black text-3xl drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">99%</span> من السوق.
            </p>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 max-w-3xl mx-auto shadow-2xl backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center shrink-0 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                <Award className="w-10 h-10 text-amber-500" />
              </div>
              <p className="text-white font-bold text-xl md:text-2xl leading-relaxed text-center md:text-right">
                نحن لا نروّج فقط، بل نبني منظومات تجعل الترويج أسهل... وربما غير ضروري.
              </p>
            </motion.div>
          </div>
        </Card>

        {/* Ecosystem Section */}
        <section id="ecosystem" className="space-y-24">
          <SectionTitle icon={Globe}>المنظومة المتكاملة</SectionTitle>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sooq Alketab - Mother Page */}
            <Card className="flex flex-col h-full border-amber-500/10">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-10 group/img border border-white/10 shadow-2xl">
                <img 
                  src="/Images/Sooqalketab.jpg" 
                  alt="Sooq Alketab" 
                  className="w-full h-full object-cover object-top scale-[1.15] group-hover/img:scale-[1.3] transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/20 to-transparent" />
              </div>
              
              <div className="flex-grow space-y-8">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white">Sooq Alketab</h3>
                  <p className="text-amber-500 font-bold tracking-widest uppercase">العمق والثقافة</p>
                </div>

                <div className="space-y-3">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الجمهور المستهدف:</p>
                  <p className="text-slate-400 font-medium">الكتاب الطموحون - القراء الملهمون - المؤسسات الثقافية</p>
                </div>
                
                <p className="text-slate-400 text-lg leading-relaxed">
                  الوجهة الأولى للمعرفة، حيث نجمع بين المحتوى الثقافي الرصين والتجربة الرقمية الحديثة.
                </p>

                <div className="space-y-4">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الخدمات الأساسية:</p>
                  <ul className="grid grid-cols-1 gap-3">
                    {[
                      'تطوير الفكرة المحورية',
                      'مراجعة النصوص وتحريرها',
                      'التدقيق اللغوي',
                      'تصميم الغلاف والهوية البصرية',
                      'خدمات الطباعة والنشر',
                      'دعم المؤلفين والكتاب',
                      'التوزيع الرقمي والورقي',
                      'حماية حقوق الملكية'
                    ].map((s) => (
                      <li key={s} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-4">
                  <motion.a whileHover={{ y: -3 }} href="https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 hover:text-amber-500 transition-all">
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 hover:text-amber-500 transition-all">
                    <Instagram className="w-6 h-6" />
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="https://wa.me/message/F7R7RTGBN4BEP1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 hover:text-amber-500 transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </motion.a>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-colors shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
                  زيارة المنصة
                </button>
              </div>
            </Card>

            {/* Sooq Alketab Plus */}
            <Card className="flex flex-col h-full border-yellow-500/10">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-10 group/img border border-white/10 shadow-2xl">
                <img 
                  src="/Images/plus.jpg" 
                  alt="Sooq Alketab Plus" 
                  className="w-full h-full object-cover object-top scale-[1.15] group-hover/img:scale-[1.3] transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/20 to-transparent" />
              </div>
              
              <div className="flex-grow space-y-8">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white">Sooq Alketab Plus</h3>
                  <p className="text-yellow-500 font-bold tracking-widest uppercase">الأعمال والاحترافية</p>
                </div>

                <div className="space-y-3">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الجمهور المستهدف:</p>
                  <p className="text-slate-400 font-medium">أصحاب المشاريع - المسوقون - الباحثون عن التميز الرقمي</p>
                </div>
                
                <p className="text-slate-400 text-lg leading-relaxed">
                  حلول متكاملة للشركات والمؤسسات، نركز على الهوية البصرية والنمو الاستراتيجي.
                </p>

                <div className="space-y-4">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الخدمات الأساسية:</p>
                  <ul className="grid grid-cols-1 gap-3">
                    {[
                      'إدارة الصفحات باحترافية',
                      'تصميم المواقع',
                      'حملات إعلانية دقيقة',
                      'عرض منتجات باحتراف',
                      'تخطيط فرص إعلانية',
                      'صناعة محتوى مرئي إبداعي',
                      'استراتيجية محتوى مبنية على البيانات',
                      'تطوير مستمر بعد التسليم'
                    ].map((s) => (
                      <li key={s} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-4">
                  <motion.a whileHover={{ y: -3 }} href="https://www.facebook.com/share/1D4H22L7eH/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all">
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="https://www.instagram.com/sooqalketab_plus?igsh=MWQyZ3Iwd3ltbGs1ZQ==" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all">
                    <Instagram className="w-6 h-6" />
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="https://wa.me/message/LVPNQNYJE3PLD1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </motion.a>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400 transition-colors shadow-[0_10px_30px_rgba(234,179,8,0.3)]">
                  زيارة المنصة
                </button>
              </div>
            </Card>

            {/* Sooq Alketab Tech */}
            <Card className="flex flex-col h-full border-emerald-500/10">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-10 group/img border border-white/10 shadow-2xl">
                <img 
                  src="/IMG_4564.jpg" 
                  alt="Sooq Alketab Tech" 
                  className="w-full h-full object-cover object-top scale-[1.15] group-hover/img:scale-[1.3] transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/20 to-transparent" />
              </div>
              
              <div className="flex-grow space-y-8">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white">Sooq Alketab Tech</h3>
                  <p className="text-emerald-500 font-bold tracking-widest uppercase">التقنية والذكاء</p>
                </div>

                <div className="space-y-3">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الجمهور المستهدف:</p>
                  <p className="text-slate-400 font-medium">مستخدمو الهواتف - عشاق التقنية - الباحثون عن الجودة</p>
                </div>
                
                <p className="text-slate-400 text-lg leading-relaxed">
                  مختبرنا التقني لتطوير الأنظمة الذكية والحلول البرمجية المبتكرة.
                </p>

                <div className="space-y-4">
                  <p className="text-white font-black text-sm uppercase tracking-widest">الخدمات الأساسية:</p>
                  <ul className="grid grid-cols-1 gap-3">
                    {[
                      'شواحن أصلية وسريعة',
                      'سماعات ذات جودة عالية',
                      'كفرات وحماية متكاملة',
                      'شحن سريع للمحافظات',
                      'صيانة الأجهزة الذكية',
                      'استشارات تقنية متخصصة'
                    ].map((s) => (
                      <li key={s} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-4">
                  <motion.a whileHover={{ y: -3 }} href="https://www.facebook.com/share/14t2f782X7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 transition-all">
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="https://wa.me/message/F7R7RTGBN4BEP1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </motion.a>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-emerald-500 text-black font-black hover:bg-emerald-400 transition-colors shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                  زيارة المنصة
                </button>
              </div>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <div className="space-y-16 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent pointer-events-none" />
          
          {/* Hook Before */}
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative inline-block"
            >
              <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full opacity-50" />
              <p className="relative text-3xl md:text-4xl lg:text-6xl font-black text-white italic tracking-tight leading-tight">
                “الأثر الحقيقي... يُقاس بما <span className="text-amber-500">يتحرك</span>، لا بما يُقال.”
              </p>
            </motion.div>
          </div>

          {/* Intro */}
          <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black uppercase tracking-[0.3em] text-xs">
              <BarChart2 className="w-4 h-4" />
              الأرقام التي تصنع الرحلة
            </div>
            <div className="text-slate-300 leading-relaxed space-y-4 text-xl md:text-2xl font-medium">
              <p>الأرقام هنا ليست للعرض... هي انعكاس لحركة الناس داخل المنظومة.</p>
              <p className="opacity-60 text-lg">كل رقم يمثل تفاعلًا... وكل تفاعل خطوة جديدة في بناء مشروع يكبر يومًا بعد يوم.</p>
            </div>
          </div>

          {/* Counters */}
          <div className="grid md:grid-cols-2 gap-10 items-stretch relative z-10">
            {[
              { label: 'عدد الزائرين', value: stats.visitors, icon: Eye, desc: 'كل دخول إلى الموقع يضيف نقطة جديدة. هذا الرقم يعكس حجم الاهتمام... وبداية كل علاقة.' },
              { label: 'عدد الضغطات', value: stats.clicks, icon: LinkIcon, desc: 'كل ضغطة على أي رابط داخل الموقع تزيد العداد واحدًا. هذا الرقم يعكس الفضول... والرغبة في معرفة المزيد.' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-12 bg-[#080808] border border-white/5 rounded-[3rem] hover:border-amber-500/40 transition-all duration-700 group shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 flex flex-col items-center h-full">
                  <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 border border-amber-500/10 group-hover:border-amber-500/30 shadow-2xl">
                    <stat.icon className="w-12 h-12 text-amber-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{stat.label}</h3>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 mb-8 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-xs flex-grow font-medium">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Share and Grow Section */}
          <ShareAndGrowSection 
            stats={stats} 
            trackShare={trackShare} 
          />

          {/* Outro */}
          <div className="text-center space-y-10 max-w-4xl mx-auto pt-12 relative z-10">
            <p className="text-slate-300 leading-relaxed text-xl md:text-2xl font-medium">
              هذه الأرقام ليست نهاية الطريق... بل إشارات على أننا نسير في الاتجاه الصحيح، وأن المنظومة تتحرك... وتتوسع... وتكبر مع كل خطوة.
            </p>
            
            {/* Hook After */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative inline-block"
            >
              <div className="absolute -inset-4 bg-amber-500/10 blur-xl rounded-full opacity-30" />
              <p className="relative text-3xl md:text-4xl lg:text-5xl font-black text-white italic tracking-tight">
                “حين يتحرك الناس... <span className="text-amber-500">تتحرك الفكرة</span>.”
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="contact"
          className="relative overflow-hidden bg-[#080808] border border-white/5 rounded-[3.5rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10">
            <SectionTitle icon={Mail}>تواصل معي</SectionTitle>
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-4xl font-black text-white leading-tight">هل لديك فكرة أو مشروع؟</h3>
                  <p className="text-slate-400 text-xl leading-relaxed font-medium">
                    يسعدني دائمًا التعاون والعمل على شيء جديد ومميز. تواصل معي لنبدأ رحلة النجاح معًا.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    { icon: Mail, label: 'البريد الإلكتروني', value: 'sooq.alketab.dv@gmail.com' },
                    { icon: Phone, label: 'رقم الهاتف', value: '00966551628760 / 00963940392619' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group/info">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover/info:bg-amber-500/20 transition-all duration-500 border border-white/5 group-hover/info:border-amber-500/30 shadow-lg">
                        <item.icon className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-2">{item.label}</p>
                        <p className="text-white font-black text-xl md:text-2xl tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-8">تابعني على المنصات</p>
                  <div className="flex gap-6">
                    {[
                      { icon: Facebook, url: 'https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr' },
                      { icon: Instagram, url: 'https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==' },
                      { icon: MessageSquare, url: 'https://wa.me/message/F7R7RTGBN4BEP1' }
                    ].map((social, i) => (
                      <motion.a 
                        key={i} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        whileHover={{ y: -5, scale: 1.05 }}
                        className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-amber-500/20 transition-all duration-500 border border-white/5 hover:border-amber-500/30 shadow-2xl group"
                      >
                        <social.icon className="w-7 h-7 text-white group-hover:text-amber-500 transition-colors" strokeWidth={1.5} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="bg-white/5 p-10 md:p-12 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                
                <div className="space-y-3">
                  <label className="text-slate-400 text-xs font-black mr-2 uppercase tracking-[0.2em]">الاسم الكامل</label>
                  <input 
                    type="text" 
                    placeholder="اكتب اسمك هنا..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-white placeholder:text-slate-600 font-bold"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-slate-400 text-xs font-black mr-2 uppercase tracking-[0.2em]">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    placeholder="example@mail.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-white placeholder:text-slate-600 font-bold"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-slate-400 text-xs font-black mr-2 uppercase tracking-[0.2em]">رسالتك</label>
                  <textarea 
                    placeholder="كيف يمكنني مساعدتك؟"
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-white placeholder:text-slate-600 font-bold resize-none"
                    required
                  ></textarea>
                </div>
                <button className="w-full group relative bg-amber-500 hover:bg-amber-600 text-white font-black py-6 rounded-2xl shadow-[0_20px_40px_rgba(245,158,11,0.3)] transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="text-xl uppercase tracking-wider">إرسال الرسالة</span>
                  <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Back to Top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, backgroundColor: '#D4AF37' }}
          className="fixed bottom-10 right-10 w-16 h-16 bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500 hover:text-white transition-all duration-500 z-50 shadow-2xl"
        >
          <ArrowUp className="w-8 h-8" strokeWidth={2.5} />
        </motion.button>

      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/20">S</div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tight">Sooq Alketab</span>
                  <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">العمق والثقافة</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm max-w-xs text-center md:text-right leading-relaxed">
                منظومة متكاملة تجمع بين المعرفة والتقنية لصناعة أثر حقيقي ومستدام.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-4">
                {[
                  { icon: Facebook, url: 'https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr' },
                  { icon: Instagram, url: 'https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==' },
                  { icon: MessageSquare, url: 'https://wa.me/message/F7R7RTGBN4BEP1' },
                  { icon: Send, url: 'https://t.me/sooqalketab' }
                ].map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-amber-500/20 transition-all border border-white/5 hover:border-amber-500/30">
                    <social.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} SOOQ ALKETAB. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
