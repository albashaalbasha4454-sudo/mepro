import { ArrowLeft, CheckCircle2, Code2, FileText, Globe2, Layers3, LayoutDashboard, Mail, Rocket, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const services = [
  'تصميم واجهات احترافية',
  'تطوير مواقع سريعة',
  'بناء هوية رقمية',
  'تنظيم المحتوى والخدمات',
  'تجهيز للنشر',
  'تحسين قابلية التوسع'
];

const processSteps = [
  {
    icon: FileText,
    title: 'دراسة المشروع',
    description: 'نبدأ بفهم الفكرة، الجمهور، الرسالة، ونقاط القوة قبل كتابة أي كود.'
  },
  {
    icon: Layers3,
    title: 'تنظيم الهيكل',
    description: 'نقسم الواجهة إلى أقسام واضحة حتى يكون التطوير أسهل والأداء أفضل.'
  },
  {
    icon: Code2,
    title: 'تنفيذ خفيف',
    description: 'واجهة React/Vite ثابتة بدون قاعدة بيانات أو تتبع غير ضروري.'
  },
  {
    icon: Rocket,
    title: 'تجهيز للنشر',
    description: 'إعدادات Netlify جاهزة، مع مسار بناء واضح وملفات نشر منظمة.'
  }
];

const qualityPoints = [
  'لا توجد عدادات وهمية أو تتبع زوار.',
  'لا يوجد Supabase أو اتصال خارجي غير مطلوب.',
  'الصفحة مناسبة للنشر كواجهة ثابتة سريعة.',
  'البنية قابلة للتوسيع لاحقًا إلى لوحة تحكم أو متجر.'
];

function Navbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black tracking-wide text-white">Sooq Alketab</p>
          <p className="text-xs text-slate-400">منظومة رقمية احترافية</p>
        </div>
      </div>

      <a
        href="mailto:contact@example.com"
        className="hidden rounded-full border border-amber-500/30 px-5 py-2 text-sm font-bold text-amber-400 transition hover:bg-amber-500 hover:text-black md:inline-flex"
      >
        تواصل الآن
      </a>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-10 md:px-10 lg:px-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-10%] h-80 w-80 rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <Navbar />

      <div className="mx-auto grid max-w-7xl items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300">
            <Rocket className="h-4 w-4" />
            نسخة احترافية خفيفة جاهزة للنشر
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              حضور رقمي واضح، سريع، وقابل للنمو.
            </h1>
            <p className="max-w-2xl text-xl leading-9 text-slate-300">
              واجهة تعريفية منظمة لمشروعك بدون عدادات زائفة، بدون Supabase، وبدون تحميل زائد. الهدف هو عرض الفكرة والخدمات بثقة واحترافية.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-amber-500 px-7 py-4 font-black text-black transition hover:bg-amber-400"
            >
              استعرض الخدمات
              <ArrowLeft className="h-5 w-5" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-4 font-black text-white transition hover:border-white/30 hover:bg-white/5"
            >
              منهجية العمل
            </a>
          </div>
        </div>

        <ProjectCard />
      </div>
    </section>
  );
}

function ProjectCard() {
  return (
    <div className="relative">
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0B0B10] p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Project</p>
              <h2 className="text-3xl font-black">Mepro</h2>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
              Static Ready
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: LayoutDashboard,
                title: 'واجهة تعريفية',
                description: 'تعرض الهوية، الفكرة، والخدمات الأساسية بدون تعقيد تقني.'
              },
              {
                icon: Workflow,
                title: 'بنية مقسمة',
                description: 'الأقسام مفصولة داخل مكونات واضحة لتسهيل التطوير والصيانة.'
              },
              {
                icon: Globe2,
                title: 'جاهزة للنشر',
                description: 'مناسبة لـ Netlify أو Vercel كواجهة ثابتة وسريعة.'
              }
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-black">{feature.title}</h3>
                <p className="leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="font-black text-amber-400">الخدمات الأساسية</p>
          <h2 className="text-4xl font-black md:text-5xl">واجهة تعرض المشروع بوضوح.</h2>
          <p className="text-lg leading-8 text-slate-400">
            تم استبدال قسم العدادات بقسم خدمات حقيقي لا يعتمد على أرقام غير موثقة، ويقدم قيمة مباشرة للزائر.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-xl font-black transition hover:border-amber-500/40 hover:bg-amber-500/5">
              {service}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="process" className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="font-black text-amber-400">بديل العدادات</p>
          <h2 className="text-4xl font-black md:text-5xl">منهجية عمل احترافية بدل أرقام متحركة.</h2>
          <p className="text-lg leading-8 text-slate-400">
            هذا القسم يشرح كيف يتم التعامل مع المشروع من الفكرة إلى النشر، وهو أفضل من عرض زوار وضغطات غير مرتبطة بقيمة حقيقية.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <article key={step.title} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-2xl font-black">{step.title}</h3>
              <p className="leading-8 text-slate-400">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QualitySection() {
  return (
    <section id="quality" className="px-6 pb-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-amber-500/15 to-white/[0.03] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 font-black text-amber-400">تنظيف المشروع</p>
            <h2 className="text-4xl font-black leading-tight">نسخة أخف، أوضح، وأسهل في النشر.</h2>
          </div>
          <div className="space-y-4">
            {qualityPoints.map((point) => (
              <div key={point} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-lg leading-8 text-slate-200">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="px-6 pb-24 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-sm font-black text-amber-400">الخطوة التالية</p>
          <h2 className="text-3xl font-black">اربط الموقع على Netlify ثم اختبر نسخة الإنتاج.</h2>
        </div>
        <a
          href="mailto:contact@example.com"
          className="inline-flex items-center gap-3 rounded-full bg-amber-500 px-7 py-4 font-black text-black transition hover:bg-amber-400"
        >
          <Mail className="h-5 w-5" />
          تواصل الآن
        </a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#050505] text-white" dir="rtl">
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <QualitySection />
      <ContactSection />
    </main>
  );
}
