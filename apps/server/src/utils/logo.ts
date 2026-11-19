import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedLogoBase64: string | null = null;

export const getLogoBase64 = (): string => {
  if (cachedLogoBase64) {
    return cachedLogoBase64;
  }

  const logoPath = path.resolve(__dirname, "../../public/logo.webp");
  try {
    const fileBuffer = fs.readFileSync(logoPath);
    cachedLogoBase64 = `data:image/webp;base64,${fileBuffer.toString("base64")}`;
  } catch (error) {
    console.error(`Failed to read logo file at ${logoPath}:`, error);
    cachedLogoBase64 = "";
  }

  return cachedLogoBase64;
};
