import { Rule, SchematicContext, Tree, chain, mergeWith, Source } from '@angular-devkit/schematics';
import { Project, SyntaxKind } from 'ts-morph';
import { generateFiles, addImportStatement } from './utils';
const modulePath = 'src/app/QAA/QAA.config.ts';

/**
 * 在特定数组中插入元素
 * @param arrayName 数组名
 * @param insertText 插入的文本内容
 */
function insertArrayItem(arrayName: string, insertText: string): void {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(modulePath);
  const declaration = sourceFile.getVariableDeclaration(arrayName);
  const arrayLiteralExpress = declaration!.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  const elements = arrayLiteralExpress.getElements();
  const lastElement = elements[elements.length - 1];
  // 新元素插入的位置, 需要计算当前最后个数组元素的起点位置+元素宽度, 还有4个字符的宽度我也不知道怎么来的, +上就对了
  const startPosition = lastElement.getPos() + lastElement.getText().length + 4;
  sourceFile.insertText(startPosition, `\n\t${insertText},`);
  sourceFile.saveSync();
}

export default function (options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { index, answer, analyse } = options;
    const questionSource = generateFiles(options, './template/question', 'src/app/QAA/question');
    const answerSource = generateFiles(options, './template/answer', 'src/app/QAA/answer');
    const analyseSource = generateFiles(options, './template/analyse', 'src/assets/md/analyse');
    const describeSource = generateFiles(options, './template/describe', 'src/assets/md/describe');
    const sourceList: Source[] = [];
    if (analyse) {
      sourceList.push(analyseSource);
    }
    // 在这里push是为了让创建文件时question和answer排在一起, analyse和describe排在一起
    sourceList.push(describeSource);
    sourceList.push(questionSource);
    if (answer) {
      sourceList.push(answerSource);
      addImportStatement(
        tree,
        modulePath,
        `Answer${index}Component`,
        `./answer/answer-${index}/answer-${index}.component`
      );
    }
    addImportStatement(
      tree,
      modulePath,
      `Question${index}Component`,
      `./question/question-${index}/question-${index}.component`
    );
    insertArrayItem('QUESTION', `Question${index}Component`);
    const ruleArr: Rule[] = [];
    sourceList.forEach(v => ruleArr.push(mergeWith(v)));
    return chain([]);
  };
}
