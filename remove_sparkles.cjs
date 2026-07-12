const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('f:/seriqueavenue/src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Sparkles')) {
      let orig = content;
      
      // First pass: replace <Sparkles ... /> with <></>
      content = content.replace(/<Sparkles\b[^>]*\/>/g, '<></>');
      content = content.replace(/<Sparkles\b[^>]*>[\s\S]*?<\/Sparkles>/g, '<></>');
      
      // Fix imports
      content = content.replace(/,\s*Sparkles\b/g, '');
      content = content.replace(/\bSparkles\s*,/g, '');
      content = content.replace(/{\s*Sparkles\s*}/g, '{}');
      
      if (orig !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
      }
    }
  }
});
