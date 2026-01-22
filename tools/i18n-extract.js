const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');

const OUTPUT_FILES = {
  es: path.join(__dirname, '../src/assets/i18n/es.json'),
  ca: path.join(__dirname, '../src/assets/i18n/ca.json'),
  gl: path.join(__dirname, '../src/assets/i18n/gl.json'),
};

const TRANSLATE_REGEX = [
  /{{\s*['"`]([^'"`]+)['"`]\s*\|\s*translate(?:\s*:\s*[^}]*)?\s*}}/g,
  /translate\.instant\(\s*['"`]([^'"`]+)['"`]/g,
  /translate\.get\(\s*['"`]([^'"`]+)['"`]/g,
  /marker\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
  /\w+Key\s*:\s*['"`]([^'"`]+)['"`]/g,
];

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

function extractKeys(files) {
  const keys = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    TRANSLATE_REGEX.forEach(regex => {
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
      }
    });
  });

  return [...keys];
}

function loadJson(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function deepMergePreserve(target, source) {
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMergePreserve(target[key], source[key]);
    } else {
      if (target[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }
}

function sortObjectDeep(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));

  const newObj = {};
  sortedKeys.forEach(key => {
    newObj[key] = sortObjectDeep(obj[key]);
  });

  return newObj;
}

function setNestedKey(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;

  parts.forEach((part, index) => {
    if (!current[part]) {
      current[part] = index === parts.length - 1 ? '' : {};
    }
    current = current[part];
  });
}

const files = walk(SRC_DIR);
const keys = extractKeys(files);

Object.entries(OUTPUT_FILES).forEach(([lang, file]) => {
  const existing = loadJson(file);
  const generated = {};

  keys.forEach(key => {
    setNestedKey(generated, key);
  });

  deepMergePreserve(generated, existing);
  const sorted = sortObjectDeep(generated);
  fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n');
});

console.log(`✔ Extracted ${keys.length} translation keys (nested, preserved)`);
