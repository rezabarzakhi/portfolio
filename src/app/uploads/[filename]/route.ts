import { readFile } from "node:fs/promises";
import path from "node:path";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

const uploadName = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png|webp|pdf)$/;

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!uploadName.test(filename)) return new Response(null, { status: 404 });

  try {
    const extension = path.extname(filename);
    const file = await readFile(path.join(process.cwd(), "public", "uploads", filename));
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentTypes[extension],
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Response(null, { status: 404 });
    throw error;
  }
}
