import fs from 'fs';
import path from 'path';

const tarotDir = path.join(process.cwd(), 'public', 'tarot');
const files = fs.readdirSync(tarotDir);

const mapping: Record<string, string> = {};

files.forEach(file => {
  if (file.endsWith('.png')) {
    const match = file.match(/^(\d+)-/);
    if (match) {
      const num = match[1];
      const newName = `card-${num}.png`;
      fs.renameSync(path.join(tarotDir, file), path.join(tarotDir, newName));
      mapping[file] = newName;
    }
  }
});

console.log(JSON.stringify(mapping, null, 2));
