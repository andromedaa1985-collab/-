const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Modals & Panels
  content = content.replace(/bg-\[#141419\]\/90/g, 'bg-apple-surface');
  content = content.replace(/bg-\[#141419\]\/80/g, 'bg-apple-surface');
  content = content.replace(/bg-\[#141419\]\/60/g, 'bg-apple-surface');
  content = content.replace(/bg-\[#141419\]/g, 'bg-apple-surface');
  
  // Borders
  content = content.replace(/border-white\/10/g, 'border-apple-border');
  content = content.replace(/border-white\/20/g, 'border-apple-border');
  
  // Backgrounds
  content = content.replace(/bg-white\/5/g, 'bg-apple-surface');
  content = content.replace(/bg-white\/10/g, 'bg-apple-surface-hover');
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-apple-surface-hover');
  content = content.replace(/hover:bg-white\/20/g, 'hover:bg-apple-surface-hover');
  
  // Text colors
  content = content.replace(/text-\[#888899\]/g, 'text-apple-text-muted');
  content = content.replace(/text-gray-100/g, 'text-apple-text');
  content = content.replace(/text-white\/70/g, 'text-apple-text-muted');
  content = content.replace(/text-white\/30/g, 'text-apple-text-muted\/50');
  
  // Specific text-white replacements (avoiding buttons that need to stay white)
  content = content.replace(/text-white font-medium/g, 'text-apple-text font-medium');
  content = content.replace(/text-white font-bold/g, 'text-apple-text font-bold');
  content = content.replace(/text-white text-sm/g, 'text-apple-text text-sm');
  content = content.replace(/text-sm text-white/g, 'text-sm text-apple-text');
  content = content.replace(/text-lg text-white/g, 'text-lg text-apple-text');
  content = content.replace(/text-xl text-white/g, 'text-xl text-apple-text');
  content = content.replace(/text-2xl text-white/g, 'text-2xl text-apple-text');
  content = content.replace(/text-white mb-/g, 'text-apple-text mb-');
  
  fs.writeFileSync(filePath, content);
  console.log(`Processed ${filePath}`);
}

processFile('src/pages/Home.tsx');
processFile('src/components/Layout.tsx');
processFile('src/pages/Bazi.tsx');
processFile('src/pages/Simulator.tsx');
processFile('src/pages/Diary.tsx');
processFile('src/pages/Guardian.tsx');
processFile('src/pages/Profile.tsx');
processFile('src/pages/Settings.tsx');
processFile('src/pages/Collection.tsx');
