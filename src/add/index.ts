import { Rule, SchematicContext, Tree, chain, mergeWith, Source } from '@angular-devkit/schematics';
import { generateFiles, insertArrayIdentifier, insertImportDeclaration, insertMenu, showMessage } from './utils';
import { Option } from './utils/interface';

export default function (option: Option): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const { id, answer, analyse } = option;
    const questionSource = generateFiles(option, './template/question', 'src/app/QAA/question');
    const answerSource = generateFiles(option, './template/answer', 'src/app/QAA/answer');
    const analyseSource = generateFiles(option, './template/analyse', 'src/assets/md/analyse');
    const describeSource = generateFiles(option, './template/describe', 'src/assets/md/describe');
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
        `import { Answer${id}Component } from './answer/answer-${id}/answer-${id}.component';`
      );
      insertArrayIdentifier('ANSWER', `Answer${id}Component`);
    }
    insertImportDeclaration(
      'Question',
      `import { Question${id}Component } from './question/question-${id}/question-${id}.component';`
    );
    insertArrayIdentifier('QUESTION', `Question${id}Component`);
    insertMenu(option);
    const ruleArr: Rule[] = [];
    sourceList.forEach(v => ruleArr.push(mergeWith(v)));
    showMessage();
    return chain(ruleArr);
  };
}
