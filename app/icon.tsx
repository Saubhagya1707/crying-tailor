import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const contentType = "image/png";

export default async function Icon() {
  const file = await readFile(join(process.cwd(), "public", "logo.png"));
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
