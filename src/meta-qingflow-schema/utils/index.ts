import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { apply, move, Source, template, Tree, url } from '@angular-devkit/schematics';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange, NoopChange } from '@schematics/angular/utility/change';
import { normalize } from '@angular-devkit/core';

function getTsSourceFile(host: Tree, path: string) {
  const buffer = host.read(path) as Buffer;
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  return source;
}

/** 导入文件 */
export function addImportStatement(tree: Tree, filePath: string, importName: string, importPath: string): void {
  let source = getTsSourceFile(tree, filePath);
  const importChange = insertImport(source, filePath, importName, importPath) as InsertChange;
  if (!(importChange instanceof NoopChange)) {
    const recorder = tree.beginUpdate(filePath);
    recorder.insertLeft(importChange.pos, importChange.toAdd);
    tree.commitUpdate(recorder);
  }
}

/** 新增模板文件 */
export function generateFiles(options: any, templateURL: string, targetUrl: string): Source {
  const movePath = normalize(targetUrl);
  const sourceParametrizedTemplates = apply(url(templateURL), [
    template({
      ...options, // 用户输入的参数
    }),
    move(movePath),
  ]);
  return sourceParametrizedTemplates;
}