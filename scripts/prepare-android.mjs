// Stage only the app shell and bundled Gita content for the offline Android app.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'www');
const files = ['index.html', 'manifest.webmanifest', 'sw.js'];
const directories = ['css', 'data', 'icons', 'js'];

await fs.rm(target, { recursive: true, force: true });
await fs.mkdir(target, { recursive: true });
for (const file of files) await fs.copyFile(path.join(root, file), path.join(target, file));
for (const directory of directories) {
  await fs.cp(path.join(root, directory), path.join(target, directory), { recursive: true });
}
const vendor = path.join(target, 'vendor');
await fs.mkdir(vendor, { recursive: true });
await fs.copyFile(
  path.join(root, 'node_modules/@capacitor/core/dist/capacitor.js'),
  path.join(vendor, 'capacitor.js'),
);
await fs.copyFile(
  path.join(root, 'node_modules/@capacitor/app/dist/plugin.js'),
  path.join(vendor, 'capacitor-app.js'),
);
const nativeIndex = path.join(target, 'index.html');
const html = await fs.readFile(nativeIndex, 'utf8');
await fs.writeFile(
  nativeIndex,
  html.replace(
    '<script src="data/gita.js"></script>',
    '<script src="vendor/capacitor.js"></script>\n' +
      '<script src="vendor/capacitor-app.js"></script>\n' +
      '<script src="data/gita.js"></script>',
  ),
);
console.log(`Prepared offline Android web assets in ${target}`);
