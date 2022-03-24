import { Rule, SchematicContext, Tree, chain, mergeWith, Source } from '@angular-devkit/schematics';
import { generateFiles, insertArrayIdentifier, insertImportDeclaration, showMessage } from './utils';

export default function (options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
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
      insertImportDeclaration(
        'Answer',
        `import { Answer${index}Component } from './answer/answer-${index}/answer-${index}.component';`
      );
      insertArrayIdentifier('ANSWER', `Answer${index}Component`);
    }
    insertImportDeclaration(
      'Question',
      `import { Question${index}Component } from './question/question-${index}/question-${index}.component';`
    );
    insertArrayIdentifier('QUESTION', `Question${index}Component`);
    const ruleArr: Rule[] = [];
    sourceList.forEach(v => ruleArr.push(mergeWith(v)));
    showMessage();
    return chain(ruleArr);
  };
}
