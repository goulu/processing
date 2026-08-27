#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const sketchName = process.argv[2];

if (!sketchName) {
  console.error('Usage: npm run new:p5 <SketchName>');
  console.error('Example: npm run new:p5 FlowField');
  process.exit(1);
}

// Format folder (PascalCase or preserve case) and readable title
const folderName = sketchName
  .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase())
  .replace(/^[a-z]/, (c) => c.toUpperCase());

const sketchTitle = sketchName
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/[-_]/g, ' ')
  .replace(/\b\w/g, (c) => c.toUpperCase());

const targetDir = path.join(rootDir, 'src', folderName);
const templateDir = path.join(rootDir, 'templates', 'p5-sketch');

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory already exists at ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const filesToCopy = ['index.html', 'sketch.js', 'style.css'];

for (const file of filesToCopy) {
  const src = path.join(templateDir, file);
  const dest = path.join(targetDir, file);
  let content = fs.readFileSync(src, 'utf8');
  content = content.replaceAll('{{TITLE}}', sketchTitle);
  fs.writeFileSync(dest, content, 'utf8');
}

// Create dedicated README.md for the new sketch
const readmeContent = `# ${sketchTitle}

Creative coding sketch created with **p5.js** and **Processing**.

---

## 📂 Contenu du dossier

| Fichier | Description |
| :--- | :--- |
| **\`sketch.js\`** | Code source du sketch en **p5.js**. |
| **\`index.html\`** | Page de prévisualisation web. |
| **\`style.css\`** | Feuilles de styles. |

---

## 🚀 Utilisation

Lancez le serveur de développement web :
\`\`\`bash
npm run dev
\`\`\`
Puis ouvrez [\`http://localhost:5173/src/${folderName}/\`](http://localhost:5173/src/${folderName}/).
`;

fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf8');

console.log(`\n✨ Successfully created new project directory in: /src/${folderName}/`);
console.log(`To start developing, run:\n  npm run dev\nand open http://localhost:5173/src/${folderName}/\n`);
