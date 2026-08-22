# Reza Barzakhi Portfolio

This repository contains the custom portfolio and publishing platform I built for my own website. I wanted one place for project case studies, articles, resume content, and contact messages without depending on a separate CMS, so I designed both the public website and its administration area as a single Next.js application.

The public interface is available in Persian and English. Persian pages use a proper RTL layout rather than mirroring isolated components, while English pages remain LTR. Most content can be maintained from the protected administration area without editing source files.

## Main features

- Persian and English routes with RTL and LTR layouts
- Responsive public pages for projects, articles, resume, and contact
- Light and dark themes with a saved user preference
- Protected administration area built with Auth.js
- Profile, skills, projects, articles, resume, and message management
- Rich-text article editor with separate Persian and English content
- Draft and published states for projects and articles
- Contact form storage with optional email notification
- Persistent uploads for project images and resume files
- Metadata, Open Graph data, `sitemap.xml`, and `robots.txt`
- Docker-based production setup with PostgreSQL and Nginx
- Backup, restore, and deployment scripts

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React and Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js |
| Validation | Zod |
| Email | Nodemailer |
| Deployment | Docker Compose and Nginx |

## Project structure

```text
portfolio/
├── deploy/                 Nginx, deployment, backup, and restore files
├── prisma/                 Schema, migrations, and seed data
├── public/uploads/         Persistent user uploads
├── src/
│   ├── app/                Public routes, admin routes, and Server Actions
│   ├── components/         Shared UI, forms, navigation, and editor
│   └── lib/                Database, auth, validation, email, and sanitization
├── tests/                  Content and validation tests
├── docker-compose.yml
└── Dockerfile
```

## Run with Docker

You need Docker Engine, Docker Compose, and Git.

```bash
git clone https://github.com/rezabarzakhi/portfolio.git
cd portfolio
cp .env.example .env
```

Replace every placeholder in `.env`, especially the database password, Auth.js secret, administrator credentials, and public site URL. Then run:

```bash
chmod +x deploy/*.sh
./deploy/deploy.sh
```

The application becomes available at:

```text
http://localhost:3000/fa
http://localhost:3000/en
http://localhost:3000/admin/login
```

## Local development

```bash
npm ci --legacy-peer-deps
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

Before committing a change, I run the same checks used by GitHub Actions:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Content and security decisions

Public and administrative forms are validated on the server. Passwords are hashed with bcrypt, administration routes require a valid session, and rich article content is sanitized before rendering. Uploads are restricted by file type and size. The contact form also includes rate limiting and a honeypot field.

These controls reduce common risks, but they do not replace production monitoring, regular dependency updates, TLS, restricted database access, and off-site backups.

## Deployment workflow

Every push to `main` runs linting, type checking, and automated tests. Docker image publishing and server deployment are optional because they require private infrastructure credentials.

To enable production deployment, add the required repository secrets and set this GitHub Actions repository variable:

```text
ENABLE_PRODUCTION_DEPLOY=true
```

Required secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
DEPLOY_SSH_KEY
DEPLOY_KNOWN_HOSTS
DEPLOY_HOST
DEPLOY_PORT
DEPLOY_USER
```

## Backup and restore

Create a backup of PostgreSQL data and uploaded files:

```bash
./deploy/backup.sh
```

Restore both parts from matching backup files:

```bash
./deploy/restore.sh \
  data/backups/database-TIMESTAMP.dump \
  data/backups/uploads-TIMESTAMP.tar.gz
```

---

<div dir="rtl">

## معرفی فارسی

این مخزن نسخه اختصاصی Portfolio من است که با Next.js و TypeScript توسعه داده شده است. هدفم ساخت یک وب‌سایت دوزبانه بود که Project، Article، Resume و Contact Message را بدون وابستگی به CMS جداگانه مدیریت کند.

نسخه فارسی به‌صورت کامل RTL و نسخه انگلیسی LTR است. برای مدیریت محتوای روزمره نیز Admin Panel اختصاصی در نظر گرفته شده و اطلاعات در PostgreSQL و از طریق Prisma نگهداری می‌شوند.

این پروژه فقط یک قالب Front-End نیست. Authentication، Content Management، Validation، File Upload، Email، Docker Deployment و Backup بخشی از ساختار آن هستند. جزئیات راه‌اندازی و محدوده ملاحظات امنیتی در بخش‌های انگلیسی همین README توضیح داده شده‌اند.

</div>

## License

Released under the [MIT License](LICENSE).
