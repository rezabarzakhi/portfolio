CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Reza Barzakhi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "roleFa" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "introFa" TEXT NOT NULL,
    "introEn" TEXT NOT NULL,
    "aboutFa" TEXT NOT NULL,
    "aboutEn" TEXT NOT NULL,
    "locationFa" TEXT NOT NULL,
    "locationEn" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "availabilityFa" TEXT NOT NULL,
    "availabilityEn" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "aboutImage" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "githubUrl" TEXT,
    "instagramUrl" TEXT,
    "telegramUrl" TEXT,
    "twitterUrl" TEXT,
    "seoDescriptionFa" TEXT NOT NULL,
    "seoDescriptionEn" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 80,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryFa" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "contentFa" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "liveUrl" TEXT,
    "repositoryUrl" TEXT,
    "completedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptFa" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "contentFa" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "categoryFa" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "seoDescriptionFa" TEXT NOT NULL,
    "seoDescriptionEn" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "organizationFa" TEXT NOT NULL,
    "organizationEn" TEXT NOT NULL,
    "periodFa" TEXT NOT NULL,
    "periodEn" TEXT NOT NULL,
    "descriptionFa" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'fa',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
