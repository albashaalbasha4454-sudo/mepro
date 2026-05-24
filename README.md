# Mepro - Sooq Alketab

موقع واجهة أمامية احترافي مبني باستخدام React وTypeScript وVite. النسخة الحالية مصممة كموقع ثابت سريع بدون Supabase وبدون عدادات تتبع داخلية.

## الهدف

يعرض الموقع منظومة Sooq Alketab وخدماتها الرقمية والثقافية والتقنية من خلال صفحة تعريفية قابلة للنشر على Netlify أو Vercel.

## التشغيل المحلي

المتطلبات: Node.js 20 أو أحدث.

```bash
npm install
npm run dev
```

## بناء نسخة الإنتاج

```bash
npm run build
```

ينتج Vite ملفات النشر داخل مجلد:

```bash
dist
```

## معاينة نسخة الإنتاج محلياً

```bash
npm run preview
```

## النشر على Netlify

1. افتح Netlify.
2. اختر Import from Git.
3. اختر المستودع `albashaalbasha4454-sudo/mepro`.
4. استخدم الإعدادات التالية:

```bash
Build command: npm run build
Publish directory: dist
```

5. اضغط Deploy.

لا تحتاج إلى متغيرات Supabase أو قاعدة بيانات لهذه النسخة.

## النشر على Vercel

1. افتح Vercel.
2. اربط حساب GitHub.
3. اختر المستودع.
4. اترك Framework Preset على Vite.
5. تأكد من:

```bash
Build Command: npm run build
Output Directory: dist
```

## ملاحظات هندسية

- لا توجد حاجة إلى Supabase في النسخة الثابتة.
- لا توجد عدادات زوار أو تتبع نقرات داخلية.
- الموقع مناسب للنشر كـ Static Site.
- يفضل ضغط الصور قبل النشر النهائي لتحسين سرعة التحميل.
- يفضل إبقاء صفحة الهبوط خفيفة وتقليل الاعتمادات غير المستخدمة.
