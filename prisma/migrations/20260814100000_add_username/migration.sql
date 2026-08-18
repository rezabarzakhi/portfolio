ALTER TABLE "User" ADD COLUMN "username" TEXT;

UPDATE "User"
SET "username" = CASE
  WHEN "email" = 'reza.barzakhi@gmail.com' THEN 'rezabarzakhi'
  ELSE 'admin-' || substr(md5("id"), 1, 8)
END;

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
