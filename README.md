<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mepro - Sooq Alketab

تطبيق واجهة أمامية مبني باستخدام React + TypeScript + Vite، ومجهز للنشر المجاني على Vercel أو Netlify.

## التشغيل المحلي

**المتطلبات:** Node.js 20 أو أحدث.

1. تثبيت الحزم:

```bash
npm install
```

2. إنشاء ملف `.env.local` عند الحاجة، ثم إضافة متغيرات Supabase الاختيارية:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> إن لم تضف مفاتيح Supabase سيعمل التطبيق بالإحصائيات الافتراضية، لكن التتبع المباشر لن يعمل.

3. تشغيل التطبيق:

```bash
npm run dev
```

4. بناء نسخة الإنتاج:

```bash
npm run build
```

5. معاينة نسخة الإنتاج:

```bash
npm run preview
```

## النشر المجاني على Vercel

1. افتح https://vercel.com/new
2. اربط حساب GitHub.
3. اختر المستودع `albashaalbasha4454-sudo/mepro`.
4. اترك الإعدادات كما هي:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. إن كنت تستخدم Supabase، أضف المتغيرات التالية في Environment Variables:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. اضغط Deploy.

ملف `vercel.json` موجود في المشروع لضبط البناء والتوجيهات.

## النشر المجاني على Netlify

1. افتح https://app.netlify.com/start
2. اختر Import from Git.
3. اختر المستودع `albashaalbasha4454-sudo/mepro`.
4. استخدم الإعدادات التالية:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. إن كنت تستخدم Supabase، أضف المتغيرات التالية:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. اضغط Deploy.

ملف `netlify.toml` موجود في المشروع لضبط البناء والتوجيهات.

## ملاحظات مهمة

- لا ترفع ملف `.env.local` إلى GitHub.
- المفاتيح التي تبدأ بـ `VITE_` تظهر في كود المتصفح، لذلك استخدم فقط مفاتيح عامة مثل Supabase anon key، ولا تضع مفاتيح سرية خاصة.
- المشروع مضبوط كـ Single Page Application، لذلك تم إضافة rewrite/redirect حتى تعمل الروابط الداخلية بعد النشر.

View your app in AI Studio: https://ai.studio/apps/6afe32d8-656f-4e56-9004-6696b2204833
