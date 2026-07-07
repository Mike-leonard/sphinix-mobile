const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.js') || dirPath.endsWith('.jsx')) {
      callback(dirPath);
    }
  });
};

const regexReplace = (content, regex, replaceFn) => {
  return content.replace(regex, replaceFn);
};

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // H1 mappings
  content = content.replace(/<h1([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    p1 = p1.replace(/\s*style=\{\{fontSize:\s*"[^"]+"\}\}\s*/g, ' ');
    let position = '--font-size-h1-default';
    if (filePath.includes('dashboard') || filePath.includes('activities') || filePath.includes('profile')) position = '--font-size-h1-dashboard';
    else if (filePath.includes('auth')) position = '--font-size-h1-auth';
    else if (filePath.includes('devices')) position = '--font-size-h1-device';
    else if (filePath.includes('blogs')) position = '--font-size-h1-blogs';
    else if (filePath.includes('comparisons')) position = '--font-size-h1-comparisons';
    else if (filePath.includes('HeroCarousel')) position = '--font-size-h1-hero';
    return `<h1${p1}style={{fontSize: "var(${position}, var(--font-size-h1-default))"}} className="${p2}"`;
  });

  // H2 mappings
  content = content.replace(/<h2([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    // Prevent double style injection
    p1 = p1.replace(/\s*style=\{\{fontSize:\s*"[^"]+"\}\}\s*/g, ' ');

    // If it's explicitly styled as very small, ignore it
    if (p2.includes('text-xs') || p2.includes('text-sm')) {
      return `<h2${p1}className="${p2}"`;
    }

    let position = '--font-size-h2-default';
    if (p2.includes('text-xl') || p2.includes('text-lg')) position = '--font-size-h2-settings';
    if (p2.includes('text-3xl') || p2.includes('text-2xl')) {
      if (p2.includes('font-extrabold') || filePath.includes('_sections')) position = '--font-size-h2-section';
      else if (filePath.includes('_cards')) position = '--font-size-h2-card';
    }
    if (filePath.includes('modal') || filePath.includes('drawer')) position = '--font-size-h2-modal';
    
    return `<h2${p1}style={{fontSize: "var(${position}, var(--font-size-h2-default))"}} className="${p2}"`;
  });

  // H3 mappings
  content = content.replace(/<h3([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    p1 = p1.replace(/\s*style=\{\{fontSize:\s*"[^"]+"\}\}\s*/g, ' ');
    let position = '--font-size-h3-default';
    if (filePath.includes('_cards')) position = '--font-size-h3-card';
    else if (filePath.includes('settings')) position = '--font-size-h3-settings';
    else if (p2.includes('font-bold') || p2.includes('text-xl')) position = '--font-size-h3-section';
    return `<h3${p1}style={{fontSize: "var(${position}, var(--font-size-h3-default))"}} className="${p2}"`;
  });

  // P mappings
  content = content.replace(/<p([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    p1 = p1.replace(/\s*style=\{\{fontSize:\s*"[^"]+"\}\}\s*/g, ' ');
    let position = '--font-size-p-default';
    if (p2.includes('text-xs') || p2.includes('text-sm')) position = '--font-size-p-subtitle';
    if (filePath.includes('_cards')) position = '--font-size-p-card';
    if (filePath.includes('Footer')) position = '--font-size-p-footer';
    if (p2.includes('text-red-500') || p2.includes('text-slate-500') || filePath.includes('Form')) position = '--font-size-p-form';
    return `<p${p1}style={{fontSize: "var(${position}, var(--font-size-p-default))"}} className="${p2}"`;
  });

  // Button mappings to Shadcn Button
  let hasButton = false;
  content = content.replace(/<button([^>]*)>/g, (match, p1) => {
    let variant = 'default';
    let sizeAttr = '';
    
    let position = '--font-size-button-default';
    if (p1.includes('bg-brand-500') || p1.includes('bg-brand-600') || p1.includes('text-white')) position = '--font-size-button-primary';
    else if (p1.includes('bg-slate-100') || p1.includes('border')) position = '--font-size-button-secondary';
    if (filePath.includes('Sidebar') || filePath.includes('Nav')) position = '--font-size-button-sidebar';

    let newP1 = p1.replace(/className="\s+"/g, '');
    
    hasButton = true;
    return `<Button variant="none" size="none" style={{fontSize: "var(${position}, var(--font-size-button-default))"}} ${newP1}>`;
  });

  // Link mappings
  content = content.replace(/<(Link|a)([^>]*)className="([^"]*)"/g, (match, tag, p1, p2) => {
    p1 = p1.replace(/\s*style=\{\{fontSize:\s*"[^"]+"\}\}\s*/g, ' ');
    let position = '--font-size-link-default';
    if (filePath.includes('Footer')) position = '--font-size-link-footer';
    else if (filePath.includes('Nav') || filePath.includes('Sidebar')) position = '--font-size-link-nav';
    else position = '--font-size-link-inline';
    
    return `<${tag}${p1}style={{fontSize: "var(${position}, var(--font-size-link-default))"}} className="${p2}"`;
  });

  // Replace closing tag and inject import
  if (hasButton) {
    content = content.replace(/<\/button>/g, '</Button>');
    
    if (!content.includes('import { Button }')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex) + '\nimport { Button } from "@/components/ui/button";' + content.slice(nextLineIndex);
      } else {
        content = 'import { Button } from "@/components/ui/button";\n' + content;
      }
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
};

walkDir('./app', processFile);
if (fs.existsSync('./components')) {
  walkDir('./components', processFile);
}
