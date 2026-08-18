import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  defaultExperiences,
  defaultPosts,
  defaultProjects,
  defaultSetting,
  defaultSkills,
} from "../src/lib/content";

const prisma = new PrismaClient();

function withoutTimestamps<T extends { id: string; createdAt: Date; updatedAt: Date }>(value: T) {
  const { id, createdAt, updatedAt, ...data } = value;
  void id;
  void createdAt;
  void updatedAt;
  return data;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const username = (process.env.ADMIN_USERNAME ?? "rezabarzakhi").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "change-this-password";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { username, passwordHash },
    create: { email, username, passwordHash },
  });

  const { updatedAt, ...settingData } = defaultSetting;
  void updatedAt;
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: settingData,
  });

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({
      data: defaultSkills.map(withoutTimestamps),
    });
  }

  if ((await prisma.project.count()) === 0) {
    for (const project of defaultProjects) {
      await prisma.project.create({ data: withoutTimestamps(project) });
    }
  }

  if ((await prisma.post.count()) === 0) {
    for (const post of defaultPosts) {
      await prisma.post.create({ data: withoutTimestamps(post) });
    }
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: defaultExperiences.map(withoutTimestamps),
    });
  }

  console.log(`Seed completed. Admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
