import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = {
  info: (message) => {
    const logMessage = `[INFO] ${new Date().toISOString()} - ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(path.join(logDir, "server.log"), logMessage);
  },
  error: (message, error) => {
    const errorStr = error ? (error.stack || error.message || String(error)) : "";
    const logMessage = `[ERROR] ${new Date().toISOString()} - ${message} ${errorStr}\n`;
    console.error(logMessage.trim());
    fs.appendFileSync(path.join(logDir, "error.log"), logMessage);
  },
  warn: (message) => {
    const logMessage = `[WARN] ${new Date().toISOString()} - ${message}\n`;
    console.warn(logMessage.trim());
    fs.appendFileSync(path.join(logDir, "server.log"), logMessage);
  }
};
