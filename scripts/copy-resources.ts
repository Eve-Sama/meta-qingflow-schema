import * as fs from 'fs-extra';
import * as path from 'path';

const srcPath = path.join(process.cwd(), 'src');
const targetPath = path.join(process.cwd(), 'dist/meta-qingflow-schema');
const copyFilter = (p: string) => !p.endsWith('.ts');

export function copyResources(): void {
  fs.copySync(srcPath, targetPath, { filter: copyFilter });
  fs.copyFile(path.join(process.cwd(), 'README.md'), path.join(targetPath, 'README.md'));
  fs.copyFile(path.join(process.cwd(), 'package.json'), path.join(targetPath, 'package.json'));
  fs.copyFile(path.join(process.cwd(), 'LICENSE'), path.join(targetPath, 'LICENSE'));
}
copyResources();
