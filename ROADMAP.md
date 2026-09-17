# پلن توسعهٔ پورتفولیو

> آخرین به‌روزرسانی: ۲۰۲۶-۰۸-۲۵

---

## فاز ۱ — امنیت و زیرساخت (اولویت بالا)

### ۱.۱ Rate Limiting سراسری
- [ ] نصب `next-rate-limit` یا پیاده‌سازی middleware سفارشی
- [ ] اعمال روی فرم تماس: حداکثر ۵ درخواست در دقیقه برای هر IP
- [ ] اعمال روی فرم ورود: حداکثر ۵ تلاش ناموفق در دقیقه
- [ ] اعمال روی API uploads: حداکثر ۱۰ درخواست در دقیقه
- **فایل‌ها:** `middleware.ts` (جدید)، `src/app/actions.ts`
- **تقریب زمان:** ۲ ساعت

### ۱.۲ Middleware احراز هویت
- [ ] ایجاد `middleware.ts` در ریشهٔ پروژه
- [ ] محافظت از تمام مسیرهای `/admin/*` با بررسی session
- [ ] ریدایرکت به `/admin/login` در صورت عدم احراز هویت
- [ ] جلوگیری از دسترسی کاربر عادی به عملیات مدیریتی
- **فایل‌ها:** `middleware.ts` (جدید)
- **تقریب زمان:** ۱.۵ ساعت

### ۱.۳ Security Headers
- [ ] اضافه‌کردن `Content-Security-Policy` به Caddyfile
- [ ] اضافه‌کردن `X-Frame-Options: DENY`
- [ ] اضافه‌کردن `Permissions-Policy`
- [ ] غیرفعال‌کردن `X-Powered-By` در next.config.ts
- **فایل‌ها:** `deploy/Caddyfile`، `next.config.ts`
- **تقریب زمان:** ۱ ساعت

### ۱.۴ Health Check Endpoint
- [ ] ایجاد `src/app/api/health/route.ts`
- [ ] بررسی اتصال پایگاه داده
- [ ] بررسی زمان پاسخ‌دهی
- [ ] برگرداندن JSON با وضعیت `ok` یا `error`
- **فایل‌ها:** `src/app/api/health/route.ts` (جدید)
- **تقریب زمان:** ۱ ساعت

### ۱.۵ Backup خودکار
- [ ] اضافه‌کردن cron job به سرور برای اجرای روزانهٔ `backup.sh`
- [ ] نگهداری ۷ نسخهٔ آخر backup
- [ ] ارسال اعلان در صورت خطا (اختیاری)
- **فایل‌ها:** `deploy/backup.sh`
- **تقریب زمان:** ۱ ساعت

---

## فاز ۲ — تجربهٔ کاربری (اولویت بالا)

### ۲.۱ صفحهٔ ۴۰۴ سفارسی
- [ ] ایجاد `src/app/[locale]/not-found.tsx`
- [ ] طراحی صفحهٔ ۴۰۴ با استایل سایت
- [ ] پیام فارسی/انگلیسی مناسب
- [ ] دکمهٔ بازگشت به صفحهٔ اصلی
- **فایل‌ها:** `src/app/[locale]/not-found.tsx` (جدید)
- **تقریب زمان:** ۱ ساعت

### ۲.۲ Loading Skeleton
- [ ] ایجاد `src/app/[locale]/loading.tsx`
- [ ] طراحی skeleton برای صفحهٔ اصلی
- [ ] ایجاد `src/app/[locale]/blog/loading.tsx` برای مقالات
- [ ] ایجاد `src/app/[locale]/projects/loading.tsx` برای پروژه‌ها
- **فایل‌ها:** `src/app/[locale]/loading.tsx` (جدید)، `src/app/[locale]/blog/loading.tsx` (جدید)، `src/app/[locale]/projects/loading.tsx` (جدید)
- **تقریب زمان:** ۲ ساعت

### ۲.۳ Error Boundary
- [ ] ایجاد `src/app/[locale]/error.tsx`
- [ ] نمایش پیام خطای دوستانه
- [ ] دکمهٔ تلاش مجدد
- [ ] گزارش خلاصهٔ خطا (بدون اطلاعات حساس)
- **فایل‌ها:** `src/app/[locale]/error.tsx` (جدید)
- **تقریب زمان:** ۱ ساعت

### ۲.۴ دکمهٔ بازگشت به بالا
- [ ] ایجاد کامپوننت `BackToTop`
- [ ] نمایش خودکار بعد از اسکرول ۳۰۰ پیکسل
- [ ] انیمیشن نرم هنگام اسکرول
- [ ] اضافه‌کردن به layout اصلی
- **فایل‌ها:** `src/components/back-to-top.tsx` (جدید)، `src/app/[locale]/layout.tsx`
- **تقریب زمان:** ۱ ساعت

### ۲.۵ Anchor Link خودکار
- [ ] اضافه‌کردن id به بخش‌های صفحهٔ اصلی
- [ ] لینک‌دهی از منوی هدر به بخش‌ها
- [ ] اسکرول نرم به بخش مورد نظر
- **فایل‌ها:** `src/app/[locale]/page.tsx`، `src/components/site-header.tsx`
- **تقریب زمان:** ۱ ساعت

---

## فاز ۳ — سئو و محتوا (اولویت متوسط)

### ۳.۱ Structured Data (JSON-LD)
- [ ] اضافه‌کردن schema.org Person برای صفحهٔ اصلی
- [ ] اضافه‌کردن schema.org Article برای مقالات
- [ ] اضافه‌کردن schema.org Project برای پروژه‌ها
- [ ] اضافه‌کردن schema.org WebSite با searchAction
- **فایل‌ها:** `src/components/json-ld.tsx` (جدید)، `src/app/[locale]/layout.tsx`، `src/app/[locale]/blog/[slug]/page.tsx`
- **تقریب زمان:** ۲ ساعت

### ۳.۲ Hreflang کامل
- [ ] اضافه‌کردن hreflang برای هر صفحهٔ مقاله به زبان مقابل
- [ ] اضافه‌کردن hreflang برای هر صفحهٔ پروژه
- [ ] اضافه‌کردن `x-default` hreflang
- **فایل‌ها:** `src/app/[locale]/blog/[slug]/page.tsx`، `src/app/[locale]/projects/[slug]/page.tsx`
- **تقریب زمان:** ۱.۵ ساعت

### ۳.۳ OpenGraph Image خودکار
- [ ] ایجاد `src/app/[locale]/og/route.tsx`
- [ ] تولید تصویر OG با نام و عنوان پروژه/مقاله
- [ ] استفاده از `next/og` برای رندر سمت سرور
- **فایل‌ها:** `src/app/[locale]/og/route.tsx` (جدید)
- **تقریب زمان:** ۳ ساعت

### ۳.۴ متادیتای بهبودیافته
- [ ] اضافه‌کردن `twitter:card` به متادیتا
- [ ] اضافه‌کردن `twitter:site` و `twitter:creator`
- [ ] بهبود title template برای صفحات داخلی
- **فایل‌ها:** `src/app/[locale]/layout.tsx`
- **تقریب زمان:** ۱ ساعت

---

## فاز ۴ — مدیریت محتوا (اولویت متوسط)

### ۴.۱ تاریخچهٔ تغییرات
- [ ] ایجاد مدل `ContentRevision` در Prisma schema
- [ ] ذخیرهٔ نسخهٔ قبلی هر عملیات ذخیره
- [ ] ایجاد API برای مشاهدهٔ تاریخچه
- [ ] ایجاد صفحهٔ مدیریت تاریخچه در ادمین
- **فایل‌ها:** `prisma/schema.prisma`، `src/app/admin/actions.ts`، `src/app/admin/(dashboard)/revisions/page.tsx` (جدید)
- **تقریب زمان:** ۴ ساعت

### ۴.۲ زمان‌بندی انتشار
- [ ] تغییر فیلد `publishedAt` به `scheduledAt`
- [ ] اضافه‌کردن cron job برای بررسی مقالات زمان‌بندی‌شده
- [ ] انتشار خودکار در زمان مشخص‌شده
- **فایل‌ها:** `prisma/schema.prisma`، `src/app/admin/actions.ts`، `deploy/portfolio-update`
- **تقریب زمان:** ۳ ساعت

### ۴.۳ پیش‌نمایش مقاله
- [ ] ایجاد مسیر `/admin/posts/[id]/preview`
- [ ] نمایش مقاله قبل از انتشار
- [ ] دکمهٔ انتشار از صفحهٔ پیش‌نمایش
- **فایل‌ها:** `src/app/admin/(dashboard)/posts/[id]/preview/page.tsx` (جدید)
- **تقریب زمان:** ۲ ساعت

### ۴.۴ صفحهٔ آمار ادمین
- [ ] شمارش بازدیدها با middleware ساده
- [ ] ذخیرهٔ بازدیدها در پایگاه داده
- [ ] نمودار بازدید روزانه/هفتگی
- [ ] نمایش محبوب‌ترین صفحات
- **فایل‌ها:** `prisma/schema.prisma`، `src/app/admin/(dashboard)/stats/page.tsx` (جدید)
- **تقریب زمان:** ۴ ساعت

---

## فاز ۵ — دسترس‌پذیری (اولویت متوسط)

### ۵.۱ Skip to Content
- [ ] اضافه‌کردن لینک مخفی در ابتدای body
- [ ] نمایش هنگام focus با keyboard
- [ ] لینک به main content
- **فایل‌ها:** `src/app/[locale]/layout.tsx`
- **تقریب زمان:** ۳۰ دقیقه

### ۵.۲ ARIA Live Regions
- [ ] اضافه‌کردن `aria-live="polite"` به toast notifications
- [ ] اضافه‌کردن `aria-live="assertive"` به پیام‌های خطا
- [ ] اعلام تغییرات صفحه به screen reader
- **فایل‌ها:** `src/components/toast.tsx`، `src/components/admin-forms.tsx`
- **تقریب زمان:** ۱ ساعت

### ۵.۳ تست دسترس‌پذیری
- [ ] نصب `@axe-core/react` برای تست در محیط development
- [ ] رفع مشکلات موجود
- [ ] تست با screen reader (NVDA/VoiceOver)
- **فایل‌ها:** `src/app/[locale]/layout.tsx`، `package.json`
- **تقریب زمان:** ۲ ساعت

---

## فاز ۶ — تست‌نویسی (اولویت پایین)

### ۶.۱ تست‌های واحد
- [ ] نصب vitest
- [ ] تست validation schemas
- [ ] تست utility functions
- [ ] تست sanitize-content
- **فایل‌ها:** `vitest.config.ts` (جدید)، `tests/validation.test.ts` (جدید)، `tests/sanitize.test.ts` (جدید)
- **تقریب زمان:** ۳ ساعت

### ۶.۲ تست‌های یکپارچه
- [ ] تست server actions
- [ ] تست فرم‌ها با `@testing-library/react`
- [ ] تست احراز هویت
- **فایل‌ها:** `tests/actions.test.ts` (جدید)، `tests/forms.test.ts` (جدید)
- **تقریب زمان:** ۴ ساعت

### ۶.۳ تست E2E
- [ ] نصب Playwright
- [ ] تست جریان ورود/خروج ادمین
- [ ] تست ارسال فرم تماس
- [ ] تست ناوبری سایت
- **فایل‌ها:** `playwright.config.ts` (جدید)، `tests/e2e/` (جدید)
- **تقریب زمان:** ۴ ساعت

---

## فاز ۷ — زیرساخت و استقرار (اولویت پایین)

### ۷.۱ Jitsi Meet
- [ ] اجرای install.sh با stable-11031
- [ ] تست جلسهٔ ویدیویی
- [ ] تنظیم Caddy برای meet.barzakhiserv.ir
- **فایل‌ها:** `deploy/meet/install.sh`
- **تقریب زمان:** ۲ ساعت

### ۷.۲ Monitoring
- [ ] نصب Uptime Kuma روی سرور
- [ ] مانیتورینگ health check endpoint
- [ ] اعلان خودکار در صورت قطعی
- **فایل‌ها:** `docker-compose.monitoring.yml` (جدید)
- **تقریب زمان:** ۲ ساعت

### ۷.۳ CI/CD بهبودیافته
- [ ] اضافه‌کردن تست‌ها به pipeline
- [ ] اضافه‌کردن lint به pipeline
- [ ] اضافه‌کردن typecheck به pipeline
- [ ] فقط استقرار در صورت عبور تست‌ها
- **فایل‌ها:** `.github/workflows/deploy-production.yml`
- **تقریب زمان:** ۲ ساعت

---

## خلاصهٔ زمان تقریبی

| فاز | عنوان | زمان تقریبی |
|-----|-------|-------------|
| ۱ | امنیت و زیرساخت | ۶.۵ ساعت |
| ۲ | تجربهٔ کاربری | ۶ ساعت |
| ۳ | سئو و محتوا | ۷.۵ ساعت |
| ۴ | مدیریت محتوا | ۱۱ ساعت |
| ۵ | دسترس‌پذیری | ۳.۵ ساعت |
| ۶ | تست‌نویسی | ۱۱ ساعت |
| ۷ | زیرساخت و استقرار | ۶ ساعت |
| **جمع** | | **۵۱.۵ ساعت** |

---

## ترتیب پیشنهادی اجرا

1. **فاز ۱** — امنیت (بنیادی‌ترین بخش)
2. **فاز ۲** — UX (بهبود فوری تجربهٔ کاربر)
3. **فاز ۳** — سئو (دیده‌شدن در گوگل)
4. **فاز ۵** — دسترس‌پذیری (ارزش‌مند و سریع)
5. **فاز ۴** — مدیریت محتوای پیشرفته
6. **فاز ۶** — تست‌نویسی (بلندمدت)
7. **فاز ۷** — زیرساخت تکمیلی
