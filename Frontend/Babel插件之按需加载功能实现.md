---
title: Babel插件之按需加载功能实现
date: 2018-11-30 22:36:29
tags:
  - babel
  - javascript
categories:
  - Babel
---
虽然文章标题讲的是按需加载，但是后来我又加上了箭头函数转普通函数和let、const转var的代码

### Note: 
前置知识：了解babel的使用，了解JavaScript语法树
安装`babel-cli, babel-core`

我们的打包文件

```js
import antd, { Table } from 'antd';

let arrow = () => {};
const component = <Table />;
```

`.babelrc`配置

```json
{
  "presets": ["react"],
  "plugins": [
    [
      "lessimport", //这是你开发的plugin名称，包名命名为babel-plugin-xxxx
      {
        // 这些属性可以随意，最后可以在opts里面访问得到
        "libraryName": "antd",
        "modulePath": "/lib/{moduleName}",
        "styleSuffix": "css",
        "stylePath": "/lib/{moduleName}/style/index.{styleSuffix}"
      }
    ]
  ]
}
```
### 插件代码编写
这是进行转换操作的代码，在你新建的项目node_modules下面新建babel-plugin-lessimport文件夹
新建index.js，写入以下代码

```js
const babel = require('babel-core');
const type = require('babel-types');

const visitor = {
  ImportDeclaration(path, ref = { opts: {} }) {
    const specifiers = path.node.specifiers;
    const source = path.node.source;
    const libraryName = source.value;
    /**
     * 第二个判断条件是判断import语句里面有没有使用 import {xxx} 的语法，如果有，就替换
     * 不加这个条件的后果就是，死循环
     */
    if (libraryName === ref.opts.libraryName && specifiers.find(specifier => type.isImportSpecifier(specifier))) {
      const declarationNodes = [];
      specifiers.forEach(specifier => {
        /** 不是默认导入的
         *  为什么要这么判断，因为可能会有这种写法，import React, { Component } from 'react';
         */
        if (!type.isImportDefaultSpecifier(specifier)) {
          declarationNodes.push(
            /**
             * importDeclaration 第一个参数是import xxx from module 里面的xxx
             * xxx可以是 {yyy} => [importSpecifier], yyy => [importDefaultSpecifier], 空 => []
             * 第二个参数是module字符串
             */
            type.importDeclaration(
              // 添加一个默认导入的 specifier，可以多个，这样就是import xxx, yyy from "test"
              [type.importDefaultSpecifier(specifier.local)],
              // type.stringLiteral 返回一个字面量字符串
              type.stringLiteral( // {moduleName} 是在配置里面配置的，代表需要引入模块的名字
                `${libraryName}${ref.opts.modulePath.replace('{moduleName}', specifier.local.name.toLowerCase())}`
              )
            )
          );
          // 引入css 或者 less，可配置
          if (ref.opts.styleSuffix) {
            declarationNodes.push(
              type.importDeclaration(
                [], // 空的specifier, 这样就是 import from "xxxx"
                type.stringLiteral(
                  `${libraryName}${ref.opts.stylePath
                    .replace('{moduleName}', specifier.local.name.toLowerCase())
                    .replace('{styleSuffix}', ref.opts.styleSuffix)}`
                )
              )
            );
          }
          return;
        }
        declarationNodes.push(
          type.importDeclaration([type.importDefaultSpecifier(specifier.local)], type.stringLiteral(libraryName))
        );
      });
      // 一个节点替换成多个
      path.replaceWithMultiple(declarationNodes);
    }
  },
  /**
   * 转换箭头函数很简单，直接把id, 参数，函数体，是否generator，是否async函数都赋给新函数
   * 然后替换节点即可
   */ 
  ArrowFunctionExpression(path) {
    const node = path.node;
    if (node.type === 'ArrowFunctionExpression') {
      path.replaceWith(type.functionExpression(node.id, node.params, node.body, node.generator, node.async));
    }
  },
  /**
   * 把let, const转换成var 
   */
  VariableDeclaration(path) {
    const node = path.node;

    if (node.kind === 'let' || node.kind === 'const') { 
      // 变量声明的kind, 可以是var let const
      // 然后第二个参数是声明的变量，let a, b, c这里的a, b, c就是node.declarations
      const varNode = type.variableDeclaration('var', node.declarations);
      path.replaceWith(varNode);
    }
  },
};
module.exports = function() {
  // 名称必须是visitor
  return { visitor };
};
```

第一个 Node 是 source 的值，第二个是 specifiers 的值
你也可以去astexplorer看对应的语法树（网址在文末给出）
![20181130232913.png](https://i.loli.net/2018/11/30/5c0157496c5bc.png)
### 执行，查看插件转换效果
对代码执行

```bash
babel index.js --out-file out.js
```

转换后的代码为，说明转换成功了

```js
import antd from 'antd';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/index.css';

var arrow = function (x = 5) {
  console.log(x);
};

var component = React.createElement(Table, null);
```
看到这就要恭喜你啦，再也不用写这种啰里啰嗦，打包出来文件体积还大的代码了
```js
import {Table} from "antd";
import from "antd/lib/table/style/index.css";
```
使用插件后只需要第一句即可完成按需引入和自动引入css
还可以配置多个不同的库

以后面试当面试官问你你写过babel插件时再也不用慌了(๑•̀ㅂ•́)و✧

### 总结：

- 插件名称必须是babel-plugin-xxx
- .babelrc可以添加你的插件以及配置参数
- 插件编写必须遵循规范
- 当你相改变某个节点时，使用该节点名（首字母大写）称作为函数名进行访问，使用path.replaceWith或者repalceWithMultiple替换

### 参考资料：
babel-types: [官网](https://babeljs.io/docs/en/next/babel-types.html)

babel-handbook: [Babel 手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-visiting)

ast-explorer: [AST 可视化](https://astexplorer.net/)

es-tree [JavaScript 语法树规则](https://github.com/estree/estree)
