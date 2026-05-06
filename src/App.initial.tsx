import { ArrowLeft, Code2, Globe2, LayoutDashboard, Rocket, Sparkles } from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'واجهة تعريفية',
    description: 'صفحة أولية مرتبة تعرض الهوية، الفكرة، والخدمات الأساسية بدون تعقيد تقني.'
  },
  {
    icon: Code2,
    title: 'جاهزة للتطوير',
    description: 'مبنية على React وVite لتسهيل إضافة الصفحات، النماذج، وقواعد البيانات لاحقًا.'
  },
  {
    icon: Globe2,
    title: 'مناسبة للنشر المجاني',
    description: 'مهيأة للعمل على Vercel أو Netlify كواجهة أمامية ثابتة وسريعة.'
  }
];

const services = ['تصميم واجهات', 'تطوير مواقع', 'منظومات رقمية', 'تحليل أفكار', 'هوية تقنية', 'إطلاق أولي'];

export default function App() {
  return (
    <main className="min-h-screen bg-[#050505] text-white" dir="rtl">
      <section className="relative overflow-hidden px-6 py-10 md:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-[-10%] top-[-10%] h-80 w-80 rounded-full bg-amber-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px]" />
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-black">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide text-white">Sooq Alketab</p>
              <p className="text-xs text-slate-400">واجهة مبدئية</p>
            </div>
          </div>

          <a
            href="mailto:contact@example.com"
            className="hidden rounded-full border border-amber-500/30 px-5 py-2 text-sm font-bold text-amber-400 transition hover:bg-amber-500 hover:text-black md:inline-flex"
          >
            تواصل الآن
          </a>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300">
              <Rocket className="h-4 w-4" />
              نسخة أولية قابلة للنشر والتطوير
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                نبني حضورًا رقميًا واضحًا، بسيطًا، وقابلًا للنمو.
              </h1>
              <p className="max-w-2xl text-xl leading-9 text-slate-300">
                هذه واجهة مبدئية لمشروعك: صفحة تعريفية احترافية تعرض الفكرة، الخدمات، ونقطة التواصل الأولى، مع بنية قابلة للتوسع لاحقًا.
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
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-4 font-black text-white transition hover:border-white/30 hover:bg-white/5"
              >
                عن المشروع
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-white/10 bg-[#0B0B10] p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Project</p>
                    <h2 className="text-3xl font-black">Mepro</h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                    Ready
                  </div>
                </div>

                <div className="space-y-4">
                  {features.map((feature) => (
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
        </div>
      </section>

      <section id="services" className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="font-black text-amber-400">الخدمات الأولية</p>
            <h2 className="text-4xl font-black md:text-5xl">ماذا يمكن أن تعرض هذه الواجهة؟</h2>
            <p className="text-lg leading-8 text-slate-400">
              يمكن استخدام هذه الصفحة كبداية لموقع شخصي، مشروع ناشئ، متجر محتوى، أو واجهة تعريفية لخدمة رقمية.
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

      <section id="about" className="px-6 pb-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-amber-500/15 to-white/[0.03] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 font-black text-amber-400">عن النسخة</p>
              <h2 className="text-4xl font-black leading-tight">واجهة أولية خفيفة، واضحة، وقابلة للتعديل.</h2>
            </div>
            <p className="text-xl leading-10 text-slate-300">
              تم تجهيز هذه النسخة لتكون نقطة بداية فقط. لا تحتوي على لوحة تحكم، قاعدة بيانات، تسجيل دخول، أو تتبع. الهدف منها أن ترى الشكل العام للموقع أولًا، ثم نضيف الميزات تدريجيًا حسب الحاجة.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
