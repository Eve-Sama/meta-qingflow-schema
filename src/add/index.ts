import { Rule, SchematicContext, Tree, mergeWith, Source, chain } from '@angular-devkit/schematics';
import { generateFiles, addImportStatement } from './utils';

export default function (options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { index, answer, analyse } = options;
    const questionSource = generateFiles(options, './template/question', 'src/app/QAA/question');
    const answerSource = generateFiles(options, './template/answer', 'src/app/QAA/answer');
    const analyseSource = generateFiles(options, './template/analyse', 'src/assets/md/analyse');
    const describeSource = generateFiles(options, './template/describe', 'src/assets/md/describe');
    const sourceList: Source[] = [];
    const modulePath = 'src/app/QAA/QAA.config.ts';
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
    const ruleArr: Rule[] = [];
    sourceList.forEach(v => ruleArr.push(mergeWith(v)));
    return chain(ruleArr);
  };
}
