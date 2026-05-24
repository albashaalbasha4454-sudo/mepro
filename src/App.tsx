import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUp,
  Award,
  BarChart3,
  Camera,
  Code,
  Facebook,
  Globe,
  GraduationCap,
  Headphones,
  Instagram,
  Laptop,
  Mail,
  MessageSquare,
  Palette,
  PenTool,
  Phone,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7 },
};

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) => (
  <div className="mb-16 flex flex-col items-center text-center space-y-6">
    <div className="flex items-center justify-center gap-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/70" />
      {Icon ? (
        <div className="p-4 bg-amber-500/5 rounded-3xl border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <Icon className="w-7 h-7 text-amber-500" strokeWidth={1.4} />
        </div>
      ) : null}
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/70" />
    </div>
    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{children}</h2>
    <div className="h-1 w-12 bg-amber-500 rounded-full" />
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    {...fadeUp}
    whileHover={{ y: -6 }}
    className={`bg-[#0A0A0F]/70 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/[0.06] shadow-[0_30px_90px_rgba(0,0,0,0.55)] transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const SocialLink = ({ href, label, icon: Icon, variant = 'dark' }: { href: string; label: string; icon: React.ElementType; variant?: 'dark' | 'light' }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center justify-between p-5 rounded-[1.6rem] border transition-all duration-300 ${
      variant === 'light'
        ? 'bg-black/[0.04] border-black/10 hover:bg-black/10 text-black'
        : 'bg-white/[0.03] border-white/5 hover:bg-amber-500/10 hover:border-amber-500/25 text-white'
    }`}
  >
    <span className="flex items-center gap-4 font-black text-lg">
      <span className={variant === 'light' ? 'bg-black/10 p-3 rounded-2xl' : 'bg-amber-500/10 p-3 rounded-2xl'}>
        <Icon className={variant === 'light' ? 'w-6 h-6 text-black' : 'w-6 h-6 text-amber-500'} />
      </span>
      {label}
    </span>
    <ArrowLeft className="w-5 h-5" />
  </motion.a>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center pt-12">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[80%] h-[80%] bg-amber-500/5 rounded-full blur-[160px]" />
    </div>
    <div className="relative z-10 text-center space-y-12 w-full">
      <motion.div {...fadeUp} className="relative aspect-[4/5] md:aspect-video w-full max-w-5xl mx-auto rounded-[3rem] p-px bg-gradient-to-b from-amber-500/40 via-white/10 to-transparent shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="w-full h-full rounded-[2.95rem] bg-[#050505] overflow-hidden border-[16px] border-[#080808] relative">
          <img src="/images/IMG_4658.png" alt="Sooq Alketab" className="w-full h-full object-cover opacity-85" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-slate-200/80 text-lg md:text-3xl font-black tracking-[0.25em] mb-6">ليست مجرد فكرة...</p>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none">بل منظومة</h1>
            <p className="text-5xl md:text-8xl font-black text-amber-500 leading-none mt-2 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]">تتحرك</p>
          </div>
        </div>
      </motion.div>
      <motion.div {...fadeUp} className="space-y-6">
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">Sooq Alketab</h2>
        <p className="text-amber-500 font-black text-2xl md:text-3xl tracking-[0.3em]">العمق والثقافة</p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <span className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 font-bold">صانع حلول رقمية</span>
          <span className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 font-bold">مطور منظومات متكاملة</span>
          <span className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 font-bold">إدارة محتوى وهوية</span>
        </div>
      </motion.div>
    </div>
  </section>
);

const ServicesSection = () => {
  const services = [
    { title: 'التحليل العميق', text: 'دراسة الاحتياجات بدقة هندسية وتحويل التحديات إلى خطة تنفيذ واضحة.', icon: Search },
    { title: 'التنفيذ المتقن', text: 'بناء واجهات ومواقع ومنظومات قابلة للتوسع وسهلة الإدارة.', icon: Code },
    { title: 'التطوير المستمر', text: 'تحسين الأداء والمحتوى والتجربة بعد الإطلاق وفق نتائج حقيقية.', icon: Rocket },
  ];
  return (
    <section id="services">
      <SectionTitle icon={Zap}>ماذا أفعل؟</SectionTitle>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <service.icon className="w-9 h-9 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-white">{service.title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{service.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

const MethodologySection = () => {
  const steps = [
    { title: 'تشخيص المشروع', text: 'فهم الهدف، الجمهور، نقاط القوة، والمشكلة التجارية قبل التصميم.' },
    { title: 'هندسة التجربة', text: 'ترتيب المحتوى والمسارات بحيث يعرف الزائر ماذا يرى وماذا يفعل.' },
    { title: 'تصميم وتنفيذ', text: 'واجهة واضحة، هوية متماسكة، وتجربة خفيفة قابلة للنشر.' },
    { title: 'إطلاق وتحسين', text: 'تجهيز النشر، اختبار الروابط، وتحسين النسخة حسب الاستخدام الفعلي.' },
  ];
  return (
    <section className="relative py-10">
      <div className="text-center max-w-4xl mx-auto mb-12 space-y-5">
        <p className="text-3xl md:text-5xl font-black text-white italic">لا نعرض أرقاماً وهمية. نعرض منهجية عمل قابلة للقياس.</p>
        <p className="text-slate-400 text-xl leading-relaxed">تم حذف العدادات والتتبع وقاعدة البيانات. مكانها أصبح قسماً احترافياً يشرح كيف يتحول المشروع من فكرة إلى منظومة جاهزة للنشر.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={step.title} className="space-y-5">
            <div className="text-5xl font-black text-amber-500/30">{String(index + 1).padStart(2, '0')}</div>
            <h3 className="text-2xl font-black text-white">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed">{step.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

const LifecycleSection = () => {
  const items = [
    { title: 'بناء وتطوير المواقع والأنظمة', icon: Laptop },
    { title: 'تصميم الهويات والشعارات', icon: Palette },
    { title: 'إدارة الصفحات وصناعة المحتوى', icon: Share2 },
    { title: 'تصوير المنتجات باحترافية', icon: Camera },
    { title: 'تصميم المحتوى المرئي الإبداعي', icon: PenTool },
    { title: 'تخطيط المحتوى وفق بيانات حقيقية', icon: BarChart3 },
    { title: 'تطوير مستمر بعد التسليم', icon: RefreshCw },
    { title: 'دعم دائم وتحسينات', icon: Headphones },
    { title: 'برامج تدريبية وإدارة محتوى', icon: GraduationCap },
  ];
  return (
    <Card className="relative overflow-hidden">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-white">نستلم مشروعك من <span className="text-amber-500">الصفر</span></h2>
        <p className="text-slate-400 text-xl max-w-3xl mx-auto">ونبنيه خطوة بخطوة حتى يصبح منظومة كاملة تتحرك بتناغم.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <item.icon className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-slate-200 font-bold leading-tight">{item.title}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const EcosystemSection = () => {
  const platforms = [
    {
      title: 'Sooq Alketab',
      subtitle: 'العمق والثقافة',
      image: '/images/Sooqalketab.jpg',
      color: 'amber',
      text: 'وجهة معرفية تجمع بين المحتوى الثقافي الرصين والتجربة الرقمية الحديثة.',
      links: [
        { icon: Facebook, href: 'https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr' },
        { icon: Instagram, href: 'https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==' },
        { icon: MessageSquare, href: 'https://wa.me/message/F7R7RTGBN4BEP1' },
      ],
    },
    {
      title: 'Sooq Alketab Plus',
      subtitle: 'الأعمال والاحترافية',
      image: '/images/plus.jpg',
      color: 'yellow',
      text: 'حلول للشركات والمشاريع تركز على الهوية البصرية والنمو الاستراتيجي.',
      links: [
        { icon: Facebook, href: 'https://www.facebook.com/share/1D4H22L7eH/?mibextid=wwXIfr' },
        { icon: Instagram, href: 'https://www.instagram.com/sooqalketab_plus?igsh=MWQyZ3Iwd3ltbGs1ZQ==' },
        { icon: MessageSquare, href: 'https://wa.me/message/LVPNQNYJE3PLD1' },
      ],
    },
    {
      title: 'Sooq Alketab Tech',
      subtitle: 'التقنية والذكاء',
      image: '/images/IMG_4564.png',
      color: 'emerald',
      text: 'مسار تقني للحلول البرمجية والمنتجات والخدمات الرقمية الذكية.',
      links: [
        { icon: Facebook, href: 'https://www.facebook.com/share/14t2f782X7/?mibextid=wwXIfr' },
        { icon: MessageSquare, href: 'https://wa.me/message/F7R7RTGBN4BEP1' },
      ],
    },
  ];
  const colorMap: Record<string, string> = {
    amber: 'text-amber-500 hover:bg-amber-500/20',
    yellow: 'text-yellow-500 hover:bg-yellow-500/20',
    emerald: 'text-emerald-500 hover:bg-emerald-500/20',
  };
  return (
    <section id="ecosystem">
      <SectionTitle icon={Globe}>المنظومة المتكاملة</SectionTitle>
      <div className="grid lg:grid-cols-3 gap-8">
        {platforms.map((platform) => (
          <Card key={platform.title} className="flex flex-col h-full">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-8 border border-white/10">
              <img src={platform.image} alt={platform.title} className="w-full h-full object-cover object-top" loading="lazy" />
            </div>
            <div className="space-y-5 flex-grow">
              <h3 className="text-4xl font-black text-white">{platform.title}</h3>
              <p className={`${colorMap[platform.color].split(' ')[0]} font-bold tracking-widest`}>{platform.subtitle}</p>
              <p className="text-slate-400 text-lg leading-relaxed">{platform.text}</p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
              {platform.links.map((link, index) => (
                <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-2xl bg-white/5 transition-all ${colorMap[platform.color]}`}>
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

const ShareSection = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://github.com/albashaalbasha4454-sudo/mepro';
  const shareLinks = [
    { label: 'واتساب بلس', icon: MessageSquare, href: 'https://wa.me/message/LVPNQNYJE3PLD1' },
    { label: 'فيسبوك', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` },
    { label: 'إنستجرام', icon: Instagram, href: 'https://www.instagram.com/sooq_alketab' },
    { label: 'تلجرام', icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('اكتشف منظومة سوق الكتاب')}` },
  ];
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-stretch">
      <Card className="space-y-6">
        <ShieldCheck className="w-12 h-12 text-amber-500" />
        <h2 className="text-4xl font-black text-white">سر التميز</h2>
        <p className="text-slate-300 text-xl leading-relaxed">لا نقدّم خدمات منفصلة، بل حلولاً متكاملة تجمع بين التقنية، الهوية، المحتوى، والتشغيل.</p>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
          <Award className="w-10 h-10 text-amber-500 mb-4" />
          <p className="text-white font-bold text-xl leading-relaxed">نبني منظومات تجعل الترويج أسهل لأن الأساس نفسه واضح وقابل للنمو.</p>
        </div>
      </Card>
      <div className="bg-amber-500 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <h3 className="text-4xl font-black text-black leading-tight">كن جزءاً من الأثر وساهم في نمو المنظومة</h3>
          <p className="text-black/65 font-medium text-lg">شارك المشروع مع من يحتاج إلى حلول رقمية وثقافية متكاملة.</p>
          <div className="flex flex-col gap-4">
            {shareLinks.map((link) => <SocialLink key={link.label} href={link.href} label={link.label} icon={link.icon} variant="light" />)}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    window.location.href = 'mailto:sooq.alketab.dv@gmail.com?subject=طلب تواصل من موقع Sooq Alketab';
  };
  return (
    <section id="contact" className="relative overflow-hidden bg-[#080808] border border-white/5 rounded-[3rem] p-8 md:p-14">
      <SectionTitle icon={Mail}>تواصل معي</SectionTitle>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-white leading-tight">هل لديك فكرة أو مشروع؟</h3>
            <p className="text-slate-400 text-xl leading-relaxed">تواصل لنحوّل الفكرة إلى خطة واضحة وتنفيذ قابل للنشر.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-5"><Mail className="w-8 h-8 text-amber-500" /><span className="text-white font-black text-xl">sooq.alketab.dv@gmail.com</span></div>
            <div className="flex items-center gap-5"><Phone className="w-8 h-8 text-amber-500" /><span className="text-white font-black text-xl">00966551628760 / 00963940392619</span></div>
          </div>
          <div className="flex gap-4">
            <SocialLink href="https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr" label="فيسبوك" icon={Facebook} />
            <SocialLink href="https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==" label="إنستجرام" icon={Instagram} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6">
          <input type="text" placeholder="الاسم الكامل" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 text-white" required />
          <input type="email" placeholder="البريد الإلكتروني" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 text-white" required />
          <textarea placeholder="رسالتك" rows={5} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 text-white resize-none" required />
          <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3">
            إرسال الرسالة <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-14 border-t border-white/5 bg-black">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div>
        <h3 className="text-2xl font-black text-white">Sooq Alketab</h3>
        <p className="text-amber-500 text-sm font-bold tracking-widest">العمق والثقافة</p>
      </div>
      <p className="text-slate-600 text-xs font-bold tracking-[0.2em]">© {new Date().getFullYear()} SOOQ ALKETAB. ALL RIGHTS RESERVED.</p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black" dir="rtl">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[140px]" />
      </div>
      <main className="max-w-7xl mx-auto px-4 pb-24 space-y-28">
        <HeroSection />
        <motion.section {...fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">أبني ما يمكنه أن <span className="text-amber-500">يستمر</span> لا ما يتوقف.</h2>
        </motion.section>
        <ServicesSection />
        <LifecycleSection />
        <MethodologySection />
        <EcosystemSection />
        <ShareSection />
        <ContactSection />
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500 hover:text-white transition-all duration-300 z-50"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp className="w-7 h-7" />
        </motion.button>
      </main>
      <Footer />
    </div>
  );
}
