import { apply, applyTemplates, move, Source, url } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { Project, SyntaxKind, IndentationText, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import { Option } from './interface';
import * as ansiColors from 'ansi-colors';
import _ from 'lodash';

const modulePath = 'src/app/QAA/QAA.config.ts';
const project = new Project({
  manipulationSettings: { indentationText: IndentationText.TwoSpaces },
});
let messages: Array<{ type: 'UPDATE'; path: string }> = [];

/** 新增模板文件 */
export function generateFiles(options: Option, templateURL: string, targetUrl: string): Source {
  const movePath = normalize(targetUrl);
  const sourceParametrizedTemplates = apply(url(templateURL), [
    applyTemplates({
      ...options, // 用户输入的参数
    }),
    move(movePath),
  ]);
  return sourceParametrizedTemplates;
}

/**
 * 在特定数组中插入元素
 * @param arrayName 数组名
 * @param insertText 插入的文本内容
 */
export function insertArrayIdentifier(arrayName: string, insertText: string): void {
  const sourceFile = project.addSourceFileAtPath(modulePath);
  const declaration = sourceFile.getVariableDeclaration(arrayName);
  const arrayLiteralExpress = declaration!.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  arrayLiteralExpress.addElement(`${insertText},`);
  messages.push({ type: 'UPDATE', path: modulePath });
  sourceFile.saveSync();
}

/** 在菜单变量中添加配置模板 */
export function insertMenu(option: Option): void {
  const sourceFile = project.addSourceFileAtPath(modulePath);
  const declaration = sourceFile.getVariableDeclaration('MenuList');
  const arrayLiteralExpress = declaration!.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  const objectLiteralExpression = arrayLiteralExpress.getElements()[0] as ObjectLiteralExpression;
  const childrenProperty = objectLiteralExpression.getProperty('children') as PropertyAssignment;
  const childrenArrayLiteralExpress = childrenProperty.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  const { id, answer, analyse } = option;
  const contentList: string[] = [`{`, `\n\tid: '${id}',`, `\n\tquestion: Question${id}Component,`];
  if (answer) {
    contentList.push(`\n\tanswer: Answer${id}Component,`);
  }
  contentList.push(`\n\ttitle: '未命名',`);
  if (analyse) {
    contentList.push(`\n\tanalyse: true,`);
  }
  contentList.push(`\n},`);
  childrenArrayLiteralExpress.insertElement(0, contentList.join(''));
  messages.push({ type: 'UPDATE', path: modulePath });
  sourceFile.saveSync();
}

export function showMessage(): void {
  console.log(ansiColors.bold.yellow('Below infomations comes from TS-Morph'));
  messages = _.uniqBy(messages, v => `${v.type}${v.path}`);
  messages.forEach(v => {
    // 目前利用ts-morph实现的只有更新文件, 所以先写死type对应的效果
    const action = ansiColors.cyan(v.type);
    const path = ansiColors.white(v.path);
    const size = project.addSourceFileAtPath(modulePath).getFullText().length;
    console.log(`${action} ${path} (${size} bytes)`);
  });
  console.log(ansiColors.bold.yellow('Below infomations comes from Angular Schematics'));
}

/** 会在同类的import下一行插入import */
export function insertImportDeclaration(startText: string, insertText: string): void {
  const sourceFile = project.addSourceFileAtPath(modulePath);
  const declarations = sourceFile.getImportDeclarations();
  // 上一个import state出现的行数
  let lastLineNumber = 0;
  declarations.forEach((declaration, index) => {
    const namedImport = declaration.getNamedImports()[0];
    const importName = namedImport.getNameNode().getText();
    if (importName.startsWith(startText)) {
      lastLineNumber = index + 1;
    }
  });
  sourceFile.insertStatements(lastLineNumber, insertText);
  sourceFile.saveSync();
}
