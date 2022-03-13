## meta-qingflow-schema

服务于[meta-qingflow](https://github.com/Eve-Sama/meta-qingflow)的schematics

![npm run add][npm run add]

[npm run add]:https://file.qingflow.com/uploads/file/51cf7aff-3b31-4651-bc07-697d61dd974d.png

## 本地调试

本地开发时, 使用了[yalc](https://juejin.cn/post/7033400734746066957). 在完成本地开发后, 需要先进行打包.
```bash
npm run build
npm run copy
```

之后进入打包目录进行本地发布.
```bash
cd dist/meta-qingflow-schema
npm run publish:dev
```

之后在`meta-qingflow`项目中执行以下代码, 加载该插件.
```bash
yalc add @eve-sama/meta-qingflow-schema
```

## 发布

与本地发布没有多大区别. 只是在打包后需要执行的命令变成
```bash
npm publish
```