const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src/database/migrations');
const dstDir = path.resolve(__dirname, '../dist/database/migrations');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.sql'));
  for (const file of files) {
    fs.copyFileSync(path.join(srcDir, file), path.join(dstDir, file));
  }
  console.log(`✓ Copied ${files.length} SQL migrations to dist/database/migrations`);
} else {
  console.warn('! Source migrations directory not found:', srcDir);
}
