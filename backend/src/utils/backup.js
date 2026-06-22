import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { logger } from "./logger.js";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), "../../.env") });

export const performBackup = () => {
  const backupDir = path.join(process.cwd(), "backups");
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `backup-${date}`);
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    logger.error("No MONGODB_URI found, skipping backup.");
    return;
  }

  // We use mongodump if installed on the system
  const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

  logger.info(`Starting backup to ${backupPath}`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Backup error: ${error.message}`, error);
      return;
    }
    logger.info(`Backup successful! Output saved to ${backupPath}`);
  });
};

// If run directly: node src/utils/backup.js
if (process.argv[1] && process.argv[1].endsWith("backup.js")) {
  performBackup();
}
