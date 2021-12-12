import { join, normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  apply,
  mergeWith,
  template,
  url,
  move,
  Source,
  chain
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
// You don't have to export the function as default. You can also have more than one rule factory
// per file.

export async function setupOptions(host: Tree, options: any): Promise<Tree> {
  const workspace = await getWorkspace(host);
  if (!options.project) {
    options.project = workspace.projects.keys().next().value;
  }
  const project = workspace.projects.get(options.project);
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  options.path = join(normalize(project.root), 'src');
  return host;
}

// function updateArray(tree: Tree): void {
//   // const text = tree.read('src/app/question/questions.module.ts') || [];
//   const text = tree.read('src/app/question/config.ts') || [];
//   const sourceFile = ts.createSourceFile(
//     'test.ts',
//     text.toString(), // 轉成字串後丟進去以產生檔案，方便後續操作
//     ts.ScriptTarget.Latest
//   );
//   const variableDeclaration = sourceFile.statements.find(node => ts.isExportDeclaration(node)) as unknown as ts.VariableDeclaration;
//   const express = variableDeclaration;
//   console.log(express, `express`);
//   // 插入 import
//   const allImports = sourceFile.statements.filter(node => ts.isImportDeclaration(node))! as ts.ImportDeclaration[];
//   const lastImport = allImports[allImports.length - 1];
//   const importStr = `\nimport { HelloLeoChenComponent } from './feature/hello-leo-chen.component.ts';`;
//   const declarationRecorder = tree.beginUpdate('src/app/question/config.ts');
//   declarationRecorder.insertLeft(lastImport.end, importStr);
//   tree.commitUpdate(declarationRecorder);
// }

function generateFiles(options: any, templateURL: string, targetUrl: string): Source {
  const movePath = normalize(targetUrl);
  const sourceParametrizedTemplates = apply(url(templateURL), [
    template({
      ...options // 用户输入的参数
    }),
    move(movePath)
  ]);
  return sourceParametrizedTemplates;
}

export function metaQingflowSchema(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    // console.log(options, `options`);
    const { question, answer, analyse } = options;
    const questionSource = generateFiles(options, './template/question', 'src/app/question/question-list');
    const answerSource = generateFiles(options, './template/answer', 'src/app/question/answer-list');
    const analyseSource = generateFiles(options, './template/analyse', 'src/assets/md/analyse');
    const describeSource = generateFiles(options, './template/describe', 'src/assets/md/describe');
    const sourceArr: Source[] = [describeSource];
    if (question) {
      sourceArr.push(questionSource);
    }
    if (answer) {
      sourceArr.push(answerSource);
    }
    if (analyse) {
      sourceArr.push(analyseSource);
    }
    // updateArray(tree);
    const ruleArr: Rule[] = [];
    sourceArr.forEach(v => ruleArr.push(mergeWith(v)));
    return chain(ruleArr);
  };
}
