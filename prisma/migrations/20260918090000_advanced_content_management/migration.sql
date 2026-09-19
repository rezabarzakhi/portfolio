-- Content revisions and page views
CREATE TABLE "ContentRevision" (
  "id" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "title" TEXT NOT NULL DEFAULT '',
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentRevision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContentRevision_entityType_entityId_createdAt_idx" ON "ContentRevision"("entityType", "entityId", "createdAt");

CREATE TABLE "PageView" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'fa',
  "referrer" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PageView_path_createdAt_idx" ON "PageView"("path", "createdAt");

-- Scheduled publishing for posts
ALTER TABLE "Post" ADD COLUMN "scheduledAt" TIMESTAMP(3);