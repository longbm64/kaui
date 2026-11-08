import fs from 'node:fs';

const root = process.cwd();
const iconCss = fs.readFileSync(`${root}/dist/icons/kaui-icons.css`, 'utf8').trim();

const minify = value => value
  .replace(/\/\*[^!*][\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();

for (const file of ['dist/kaui.css', 'dist/kaui.min.css']) {
  const path = `${root}/${file}`;
  let css = fs.readFileSync(path, 'utf8');
  const sourceMap = css.match(/\/\*# sourceMappingURL=.*?\*\/\s*$/);
  css = css.replace(/\/\*# sourceMappingURL=.*?\*\/\s*$/, '').trimEnd();
  css += `\n\n${file.endsWith('.min.css') ? minify(iconCss) : iconCss}\n`;
  if (sourceMap) css += sourceMap[0];
  fs.writeFileSync(path, `${css.trimEnd()}\n`);
}

console.log('[build:icons:bundle] Included KAUI icon CSS in the main bundles.');
