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
  Facebook, 
  Send,
  ArrowLeft,
  Layout,
  Smartphone,
  Video,
  Palette,
  BarChart3,
  Briefcase,
  Layers,
  Check,
  Lightbulb,
  PenTool,
  Star,
  Award,
  ShieldCheck,
  Globe,
  Gift,
  BarChart2,
  Eye,
  Link as LinkIcon,
  Share2,
  Sparkles,
  Lock,
  Printer,
  FileText,
  CheckSquare,
  Headphones,
  Truck,
  Laptop,
  Camera,
  Search,
  RefreshCw,
  GraduationCap,
  ArrowUp,
  User,
  Activity,
  MousePointer2,
  Edit3
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, type UserProfile } from './lib/supabase';

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="mb-16 flex flex-col items-center text-center space-y-6">
    <div className="flex items-center justify-center gap-6">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        className="h-[1px] bg-gradient-to-r from-transparent to-amber-500/50" 
      />
      {Icon && (
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-xl"
        >
          <Icon className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
        </motion.div>
      )}
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 64 }}
        className="h-[1px] bg-gradient-to-l from-transparent to-amber-500/50" 
      />
    </div>
    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
      {children}
    </h2>
    <div className="h-1.5 w-24 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
  </div>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className={`bg-brand-card/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-amber-500/20 transition-all duration-500 group ${className}`}
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
  const [stats, setStats] = useState({
    visitors: 0,
    clicks: 0,
    shares: 0
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select()
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      if (data) {
        setStats({
          visitors: data.visitors || 0,
          clicks: data.clicks || 0,
          shares: data.shares || 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .order('shares', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      if (data) setTopUsers(data);
    } catch (err) {
      console.error('Error fetching top users:', err);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error for new users
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Initialize User and Global Stats
  useEffect(() => {
    // 1. Real-time Subscriptions (Sync setup, async subscription)
    const statsChannel = supabase
      .channel('global_stats_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stats' }, () => {
        // Data Sync Logic: Refetch on update for consistency
        fetchStats();
      })
      .subscribe();

    const usersChannel = supabase
      .channel('top_users_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchTopUsers();
      })
      .subscribe();

    const initTracking = async () => {
      setIsLoading(true);
      try {
        // 2. Handle User Identity
        let userId = localStorage.getItem('sooq_user_id');
        let profile: UserProfile | null = null;

        if (!userId) {
          userId = crypto.randomUUID();
          localStorage.setItem('sooq_user_id', userId);
          
          const { data, error } = await supabase
            .from('users')
            .insert([{ id: userId, name: 'مشارك جديد', shares: 0 }])
            .select()
            .single();
          
          if (error) throw error;
          profile = data;
        } else {
          profile = await fetchUserProfile(userId);
          
          // If ID exists in local storage but not in DB (e.g. DB reset), recreate it
          if (!profile) {
            const { data, error } = await supabase
              .from('users')
              .insert([{ id: userId, name: 'مشارك جديد', shares: 0 }])
              .select()
              .single();
            if (error) throw error;
            profile = data;
          }
        }
        setUserProfile(profile);

        // 3. Initial Stats Fetch
        await fetchStats();

        // 4. Visitor Tracking (Session based)
        const hasVisitedSession = sessionStorage.getItem('session_visited');
        if (!hasVisitedSession) {
          const { error } = await supabase.rpc('increment_visitors');
          if (!error) sessionStorage.setItem('session_visited', 'true');
        }

        await fetchTopUsers();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initTracking();

    return () => {
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const trackClick = async () => {
    try {
      const { error } = await supabase.rpc('increment_clicks');
      if (error) throw error;
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const trackShare = async () => {
    if (!userProfile) return;
    
    try {
      // Update Global
      const { error: globalError } = await supabase.rpc('increment_shares');
      if (globalError) throw globalError;
      
      // Update Individual
      const { data, error: userError } = await supabase
        .from('users')
        .update({ shares: (userProfile.shares || 0) + 1 })
        .eq('id', userProfile.id)
        .select()
        .single();
      
      if (userError) throw userError;
      if (data) setUserProfile(data);
      
      playPing();
    } catch (err) {
      console.error('Error tracking share:', err);
    }
  };

  const updateName = async (newName: string) => {
    if (!userProfile || !newName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ name: newName.trim() })
        .eq('id', userProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      if (data) setUserProfile(data);
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  return { stats, trackShare, trackClick, userProfile, topUsers, updateName, isLoading };
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

const ParticipantsBoard = ({ topUsers, userProfile, visitors }: { topUsers: UserProfile[], userProfile: UserProfile | null, visitors: number }) => {
  // If visitors < 800, show a locked state
  if (visitors < 800) {
    return (
      <div className="mt-12 p-10 border border-white/5 rounded-[2.5rem] bg-[#0B0B14] text-center relative overflow-hidden w-full shadow-2xl">
        <div className="absolute inset-0 backdrop-blur-md bg-black/60 z-10 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            <Lock className="w-8 h-8 text-slate-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-black text-white mb-3 tracking-tight">لوحة المشاركين (مقفلة)</h3>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            تُفتح اللوحة عند الوصول إلى <span className="text-amber-500 font-bold">800 زائر</span>.<br/>
            نحن الآن في <span className="text-white font-bold">{visitors}</span> زائر.
          </p>
          <div className="mt-6 w-full max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${(visitors / 800) * 100}%` }}
            />
          </div>
        </div>
        {/* Blurred mock content behind */}
        <div className="opacity-10 blur-xl select-none pointer-events-none">
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-800"></div>
                <div className="w-20 h-4 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state
  const participants = [...topUsers];
  if (userProfile && !participants.find(p => p.id === userProfile.id)) {
    participants.push(userProfile);
  }

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
        {participants.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border ${p.id === userProfile?.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-[#0B0B14]'}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-900 flex items-center justify-center text-white font-bold text-lg">
                {p.name.charAt(0)}
              </div>
              {p.shares >= 5 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0B0B14]" title="مشارك مبكر">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold flex items-center gap-2">
                {p.id === userProfile?.id ? 'أنت' : <DecodedText text={p.name} isRevealed={false} />}
                {p.id === userProfile?.id && <span className="text-xs text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded">أنت</span>}
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

const DecodedText = ({ text, isRevealed }: { text: string, isRevealed: boolean }) => {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  const arabicCharacters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

  // Privacy mask: Show only first 2 letters of each word, replace rest with asterisks
  const maskedText = text.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word.substring(0, 2) + '٭'.repeat(word.length - 2);
  }).join(' ');

  useEffect(() => {
    let interval: any;
    
    if (isRevealed) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(
          maskedText.split('').map((char, index) => {
            if (index < iteration) return maskedText[index];
            if (char === ' ' || char === '٭') return char;
            const charSet = /[\u0600-\u06FF]/.test(text) ? arabicCharacters : characters;
            return charSet[Math.floor(Math.random() * charSet.length)];
          }).join('')
        );
        if (iteration >= maskedText.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    } else {
      interval = setInterval(() => {
        setDisplayText(
          maskedText.split('').map((char, index) => {
            if (char === ' ') return ' ';
            // Show only the first character of the first word to give a hint
            if (index === 0) {
              return maskedText[0];
            }
            return Math.random() > 0.8 ? (/[a-zA-Z]/.test(char) ? characters[Math.floor(Math.random() * characters.length)] : arabicCharacters[Math.floor(Math.random() * arabicCharacters.length)]) : '█';
          }).join('')
        );
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [text, isRevealed]);

  return <span className="font-mono tracking-widest">{displayText}</span>;
};

const HallOfFame = ({ topUsers, userProfile }: { topUsers: UserProfile[], userProfile: UserProfile | null }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const members = [...topUsers];
  if (userProfile && !members.find(m => m.id === userProfile.id)) {
    members.push(userProfile);
  }
  members.sort((a, b) => b.shares - a.shares);

  const getBadge = (shares: number) => {
    if (shares >= 5) return { label: 'تأثير ماسي', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', bar: 'bg-blue-500' };
    if (shares >= 3) return { label: 'تأثير ذهبي', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', bar: 'bg-amber-500' };
    if (shares >= 2) return { label: 'تأثير فضي', color: 'bg-slate-300/10 text-slate-300 border-slate-300/20', bar: 'bg-slate-300' };
    if (shares >= 1) return { label: 'تأثير برونزي', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', bar: 'bg-orange-500' };
    return { label: 'مشارك', color: 'bg-white/5 text-slate-400 border-white/10', bar: 'bg-slate-600' };
  };

  return (
    <div className="relative overflow-hidden bg-[#050505] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl mt-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6 mb-12 relative z-20">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          مؤشر الأثر
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          سجل الأثر الرقمي
        </h2>
        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
          كل مشاركة هي بصمة رقمية توسع نطاق المنظومة وتزيد من تأثيرك الفعلي. نحن نؤمن بقوة المجتمع، ولذلك عند اكتمال <span className="text-amber-500 font-bold">1,000 مشاركة إجمالية</span>، سيتم فتح هذا السجل لإجراء <span className="text-white font-bold">سحب عشوائي موثق على جائزة قيّمة</span> لجميع المؤثرين. القائمة ستضم أسماء عديدة، وكلما زاد أثرك، تعززت مكانتك. هويات المشاركين مشفرة بالكامل لضمان الخصوصية.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
        {members.map((member, idx) => {
          const badge = getBadge(member.shares);
          const isUser = member.id === userProfile?.id;
          return (
            <div
              key={member.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative bg-[#0B0B14] border ${isUser ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-white/5 hover:border-white/10'} rounded-2xl p-6 transition-all duration-500`}
            >
              <div className="flex items-center justify-between">
                {/* Info */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white tracking-widest">
                      {isUser ? 'أنت' : <DecodedText text={member.name} isRevealed={hoveredIndex === idx} />}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md border font-bold ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-black ${member.shares > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                      {member.shares}
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full ${badge.bar} transition-all duration-1000`} style={{ width: `${Math.min((member.shares / 5) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">مرات التأثير</span>
                  </div>
                </div>

                {/* Rank */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${isUser ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 transition-colors'}`}>
                  {isUser ? 'أنت' : `#${idx + 1}`}
                </div>
              </div>
            </div>
          );
        })}

        {/* Mysterious Slot */}
        <div className="relative bg-white/[0.02] border border-white/10 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">شارك لتنضم للسجل</h4>
            <p className="text-xs text-slate-500">كن جزءاً من السحب القادم</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareAndGrowSection = ({ stats, trackShare, userProfile, updateName, topUsers }: { stats: any, trackShare: () => void, userProfile: UserProfile | null, updateName: (name: string) => void, topUsers: UserProfile[] }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile?.name || '');

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      updateName(tempName.trim());
      setIsEditingName(false);
    }
  };

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

            {/* User Identity Section */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <User className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-amber-500/50 w-32"
                          autoFocus
                        />
                        <button onClick={handleNameSubmit} className="text-amber-500 hover:text-amber-400">
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{userProfile?.name || 'مشارك جديد'}</span>
                        <button onClick={() => setIsEditingName(true)} className="text-slate-500 hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <p className="text-slate-500 text-xs">هويتك في سجل الأثر</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-amber-500 font-black text-xl">{userProfile?.shares || 0}</span>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">تأثيرك</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Card */}
        <div className="bg-amber-500 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -ml-32 -mt-32" />
          
          <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-black leading-tight">
                ساهم في نمو المنظومة<br/>واحجز مكانك في السحب
              </h3>
              <p className="text-black/60 font-medium max-w-sm">
                كل مشاركة ترفع من مستوى تأثيرك وتزيد من فرصك في الفوز بالجوائز الأسبوعية.
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

      {/* Participants Board */}
      <ParticipantsBoard topUsers={topUsers} userProfile={userProfile} visitors={stats.visitors} />
    </div>
  );
};

const ServiceItem = ({ title, icon: Icon, colorClass }: { title: string, icon: any, colorClass: string, key?: React.Key }) => (
  <motion.div 
    whileHover={{ x: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
    className="flex items-center justify-end gap-5 text-right group/item p-4 rounded-2xl transition-all duration-500 border border-transparent hover:border-white/5 cursor-default"
  >
    <span className="text-slate-300 text-sm md:text-base font-bold group-hover/item:text-white transition-colors tracking-tight">
      {title}
    </span>
    <div className={`w-12 h-12 rounded-2xl ${colorClass}/10 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-all duration-500 border ${colorClass}/10 group-hover/item:border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.3)] backdrop-blur-md`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} strokeWidth={1.5} />
    </div>
  </motion.div>
);

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
  const { stats, trackShare, trackClick, userProfile, topUsers, updateName, isLoading } = useTrackingCounters();

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

      <main className="max-w-7xl mx-auto px-4 pb-24 space-y-12">
        
        {/* Hero Section */}
        <div className="relative pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="mb-12 relative inline-block w-full max-w-7xl group">
              {/* Animated Glow Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 via-amber-400/20 to-amber-600/20 rounded-[3rem] blur-3xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative aspect-[4/5] md:aspect-[16/9] rounded-[2.5rem] p-[2px] bg-gradient-to-b from-amber-400/50 via-amber-600/30 to-transparent shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
                <div className="w-full h-full rounded-[2.4rem] bg-[#050505] flex items-center justify-center overflow-hidden border-[12px] border-[#0a0a0a]">
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
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-amber-500/50 mb-2 tracking-tight">
                Sooq Alketab
              </h1>
              <p className="text-amber-500 font-black text-xl md:text-2xl mb-6 tracking-[0.2em] uppercase">
                العمق والثقافة
              </p>
              
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
                <p className="text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed mt-6 text-center font-medium">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    أجمع بين العقل التقني، والحس الإبداعي، والفهم الإنساني.
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
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
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <SectionTitle icon={Briefcase}>ماذا أفعل؟</SectionTitle>
          <div className="space-y-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-slate-300 text-xl leading-relaxed font-medium">
                  أجمع بين <span className="text-white border-b-2 border-amber-500/50">دقة الهندسة</span> و <span className="text-white border-b-2 border-amber-500/50">ذكاء التسويق</span>،
                  لأحوّل الأفكار إلى مشاريع حقيقية، والمشاريع إلى علامات ناجحة.
                </p>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500">
                  <p className="text-amber-500 font-bold text-lg italic">
                    "عملي لا يعتمد على الحظ... بل على منهجية واضحة ونتائج قابلة للقياس."
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'بناء الأنظمة', icon: Laptop },
                  { title: 'تصميم الهويات', icon: Palette },
                  { title: 'تصوير احترافي', icon: Camera },
                  { title: 'إدارة المحتوى', icon: Share2 }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center gap-4 transition-all"
                  >
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <item.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-white font-bold text-sm uppercase tracking-wider">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/5">
              <h3 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-widest opacity-50">منهجية العمل</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'تحليل عميق', desc: 'فهم دقيق للمتطلبات والجمهور قبل البدء', icon: Search },
                  { title: 'تنفيذ دقيق', desc: 'جودة عالية في التفاصيل التقنية والبصرية', icon: Zap },
                  { title: 'تطوير مستمر', desc: 'تحسينات مبنية على البيانات والنتائج', icon: TrendingUp }
                ].map((item, i) => (
                  <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all group">
                    <div className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-amber-500/10 transition-colors">0{i+1}</div>
                    <item.icon className="w-10 h-10 text-amber-500 mb-6" />
                    <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

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
        <div className="space-y-16">
          <SectionTitle icon={Layers}>منظومة سوق الكتاب</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
            
            {/* Sooq Alketab (The Mother Page) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative flex flex-col h-full bg-[#080808] border border-white/5 rounded-[3rem] p-10 group hover:shadow-[0_40px_80px_-15px_rgba(217,119,6,0.3)] hover:border-amber-600/40 transition-all duration-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10 rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/5] relative group/img shadow-2xl">
                  <img src="/Images/Sooqalketab.jpg" alt="Sooq Alketab" className="w-full h-full object-cover object-top transition-transform duration-1000 scale-[1.1] group-hover/img:scale-[1.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex flex-col items-center justify-center gap-3 mb-10">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
                    <h3 className="text-3xl font-black text-white tracking-tight">العمق والثقافة</h3>
                  </div>
                  <span className="text-amber-500/60 text-xs font-black tracking-[0.4em] uppercase">Sooq Alketab</span>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="text-center space-y-4">
                    <p className="text-slate-200 text-lg font-bold leading-relaxed">
                      بوابتك لعالم النشر وصناعة المحتوى الأدبي.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed opacity-80">
                      نرافقك في رحلة تحويل الفكرة إلى كتاب مطبوع، من خلال خدمات تحريرية وتصميمية متكاملة تضمن جودة المحتوى وجاذبية المظهر.
                    </p>
                  </div>
                  
                  {/* Audience */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-all duration-500">
                      <span className="text-slate-300 text-sm font-bold text-right leading-relaxed">الكتّاب الطموحون – القرّاء النهمون – المؤسسات الثقافية</span>
                      <Users className="w-6 h-6 text-amber-500 shrink-0" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-2">
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
                        <ServiceItem key={i} title={service.title} icon={service.icon} colorClass="bg-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  {[
                    { label: 'فيسبوك', icon: Facebook, url: 'https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr' },
                    { label: 'إنستجرام', icon: Instagram, url: 'https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==' },
                    { label: 'واتساب', icon: MessageSquare, url: 'https://wa.me/message/F7R7RTGBN4BEP1' }
                  ].map((link, i) => (
                    <SocialLink key={i} href={link.url} label={link.label} icon={link.icon} colorClass="amber" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sooq Alketab Plus */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative flex flex-col h-full bg-[#080808] border border-white/5 rounded-[3rem] p-10 group hover:shadow-[0_40px_80px_-15px_rgba(234,179,8,0.3)] hover:border-yellow-500/40 transition-all duration-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10 rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/5] relative group/img shadow-2xl">
                  <img src="/Images/plus.jpg" alt="Sooq Alketab Plus" className="w-full h-full object-cover object-top transition-transform duration-1000 scale-[1.1] group-hover/img:scale-[1.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex flex-col items-center justify-center gap-3 mb-10">
                  <div className="flex items-center gap-4">
                    <PlusCircle className="w-10 h-10 text-yellow-500" strokeWidth={1.5} />
                    <h3 className="text-3xl font-black text-white tracking-tight">الأعمال والاحتراف</h3>
                  </div>
                  <span className="text-yellow-500/60 text-xs font-black tracking-[0.4em] uppercase">Sooq Alketab Plus</span>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="text-center space-y-4">
                    <p className="text-slate-200 text-lg font-bold leading-relaxed">
                      هنا نأخذ مشروعك إلى مرحلة الظهور والانتشار.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed opacity-80">
                      نصنع محتوى يتحدث بلغة جمهورك، ونبني استراتيجيات تسويقية مبنية على بيانات حقيقية لضمان وصول رسالتك وتحقيق أهدافك.
                    </p>
                  </div>
                  
                  {/* Audience */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:border-yellow-500/20 transition-all duration-500">
                      <span className="text-slate-300 text-sm font-bold text-right leading-relaxed">أصحاب المشاريع – المسوقون – الباحثون عن التميز الرقمي</span>
                      <Users className="w-6 h-6 text-yellow-500 shrink-0" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-2">
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
                        <ServiceItem key={i} title={service.title} icon={service.icon} colorClass="bg-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  {[
                    { label: 'فيسبوك بلس', icon: Facebook, url: 'https://www.facebook.com/share/1D4H22L7eH/?mibextid=wwXIfr' },
                    { label: 'إنستجرام بلس', icon: Instagram, url: 'https://www.instagram.com/sooqalketab_plus?igsh=MWQyZ3Iwd3ltbGs1ZQ==' },
                    { label: 'واتساب بلس', icon: MessageSquare, url: 'https://wa.me/message/LVPNQNYJE3PLD1' }
                  ].map((link, i) => (
                    <SocialLink key={i} href={link.url} label={link.label} icon={link.icon} colorClass="yellow" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sooq Alketab Technology */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative flex flex-col h-full bg-[#080808] border border-white/5 rounded-[3rem] p-10 group hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.3)] hover:border-emerald-500/40 transition-all duration-700 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10 rounded-[2.5rem] overflow-hidden border border-white/10 aspect-[4/5] relative group/img shadow-2xl">
                  <img src="/IMG_4564.jpg" alt="Sooq Alketab Tech" className="w-full h-full object-cover object-top transition-transform duration-1000 scale-[1.1] group-hover/img:scale-[1.2]" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex flex-col items-center justify-center gap-3 mb-10">
                  <div className="flex items-center gap-4">
                    <Cpu className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
                    <h3 className="text-3xl font-black text-white tracking-tight">التقنية والحلول الذكية</h3>
                  </div>
                  <span className="text-emerald-400/60 text-xs font-black tracking-[0.4em] uppercase">Sooq Alketab Tech</span>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="text-center space-y-4">
                    <p className="text-slate-200 text-lg font-bold leading-relaxed">
                      حلول تقنية ذكية لأجهزتك اليومية.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed opacity-80">
                      نوفر لك أفضل الملحقات والخدمات التقنية التي تضمن أداءً عالياً وحماية متكاملة لأجهزتك الذكية، مع التركيز على الجودة والموثوقية.
                    </p>
                  </div>
                  
                  {/* Audience */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الجمهور المستهدف
                    </h4>
                    <div className="flex items-center justify-end gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-all duration-500">
                      <span className="text-slate-300 text-sm font-bold text-right leading-relaxed">مستخدمو الهواتف – عشاق التقنية – الباحثون عن الجودة</span>
                      <Users className="w-6 h-6 text-emerald-500 shrink-0" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="pt-6 border-t border-white/5">
                    <h4 className="font-black text-white/40 mb-6 text-right text-xs uppercase tracking-[0.3em]">
                      الخدمات الأساسية
                    </h4>
                    <div className="space-y-2">
                      {[
                        { title: 'شواحن أصلية وسريعة', icon: Zap },
                        { title: 'سماعات ذات جودة عالية', icon: Headphones },
                        { title: 'كفرات وحماية متكاملة', icon: ShieldCheck },
                        { title: 'شحن سريع للمحافظات', icon: Truck },
                        { title: 'صيانة الأجهزة الذكية', icon: Smartphone },
                        { title: 'استشارات تقنية متخصصة', icon: MessageSquare },
                        { title: 'عروض وجوائز أسبوعية', icon: Gift },
                        { title: 'خصومات دورية وحصرية', icon: Sparkles }
                      ].map((service, i) => (
                        <ServiceItem key={i} title={service.title} icon={service.icon} colorClass="bg-emerald-500" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  {[
                    { label: 'فيسبوك تك', icon: Facebook, url: 'https://www.facebook.com/SooqAlketabtechnology' },
                    { label: 'إنستجرام تك', icon: Instagram, url: 'https://www.instagram.com/sooq_alketab' },
                    { label: 'واتساب تك', icon: MessageSquare, url: 'https://wa.me/00963940392619' }
                  ].map((link, i) => (
                    <SocialLink key={i} href={link.url} label={link.label} icon={link.icon} colorClass="emerald" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

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
            userProfile={userProfile}
            updateName={updateName}
            topUsers={topUsers}
          />

          {/* Hall of Fame Section */}
          <HallOfFame topUsers={topUsers} userProfile={userProfile} />

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
