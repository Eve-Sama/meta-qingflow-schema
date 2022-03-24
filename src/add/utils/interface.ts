export interface Option {
  // 新增任务序号
  id: number;
  // 是否需要生成答案组件
  answer: boolean;
  // 是否需要生成解析文件
  analyse: boolean;
}
