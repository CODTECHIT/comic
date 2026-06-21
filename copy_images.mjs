import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'WhatsApp Unknown 2026-06-21 at 3.27.09 PM');
const destDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
let i = 1;

for (const file of files) {
  if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, `comic-${i}.jpeg`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to comic-${i}.jpeg`);
    i++;
  }
}
