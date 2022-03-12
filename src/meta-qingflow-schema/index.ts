import { Rule, SchematicContext, Tree, mergeWith, Source, chain } from '@angular-devkit/schematics';
import { generateFiles, addImportStatement } from './utils';

export function metaQingflowSchema(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { index, question, answer, analyse } = options;
    const questionSource = generateFiles(options, './template/question', 'src/app/QAA/question');
    const answerSource = generateFiles(options, './template/answer', 'src/app/QAA/answer');
    const analyseSource = generateFiles(options, './template/analyse', 'src/assets/md/analyse');
    const describeSource = generateFiles(options, './template/describe', 'src/assets/md/describe');
    const sourceArr: Source[] = [describeSource];
    const modulePath = 'src/app/QAA/QAA.config.ts';
    if (question) {
      sourceArr.push(questionSource);
      addImportStatement(
        tree,
        modulePath,
        `Question${index}Component`,
        `./question/question-${index}/question-${index}.component`
      );
    }
    if (answer) {
      sourceArr.push(answerSource);
      addImportStatement(
        tree,
        modulePath,
        `Answer${index}Component`,
        `./answer/answer-${index}/answer-${index}.component`
      );
    }
    if (analyse) {
      sourceArr.push(analyseSource);
    }
    const ruleArr: Rule[] = [];
    sourceArr.forEach(v => ruleArr.push(mergeWith(v)));
    return chain(ruleArr);
  };
}
