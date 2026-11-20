import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getLogoPath = (): string => {
  return path.resolve(__dirname, "../../public/logo.webp");
};

export const getLogoUrl = (serverUrl: string): string => {
  return `${serverUrl}/logo`;
};
