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
      // Remove <Sparkles ... /> and <Sparkles>...</Sparkles> (though it's an icon, usually self-closing)
      content = content.replace(/<Sparkles\b[^>]*\/>/g, '');
      content = content.replace(/<Sparkles\b[^>]*>[\s\S]*?<\/Sparkles>/g, '');
      // Some places it might be used as `icon={<Sparkles />}` -> let's make it `icon={null}` if we just remove the tag it becomes `icon={}` which is syntax error in JSX?
      // Wait! `icon={<Sparkles className="..." />}` becomes `icon={}` which is invalid JSX.
      // Better replace `<Sparkles ... />` with `<></>` when inside braces? 
      // Actually, if we just remove the icon, maybe we can replace it with `<></>` ? Or `<React.Fragment />`?
      // Replacing with empty fragment `<></>` is safe everywhere in JSX.
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
