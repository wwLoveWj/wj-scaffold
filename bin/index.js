#!/usr/bin/env node

const yargs = require("yargs");
const path = require("path");
const { inquirerPrompt } = require("./inquirer");
const { copyTemplate, checkMkdirExists } = require("./copy");
const { install } = require("./install");
const download = require("download-git-repo");

yargs.command(
  ["create", "c"],
  "新建一个模板",
  function (yargs) {
    return yargs.option("name", {
      alias: "n",
      demand: true,
      describe: "模板名称",
      type: "string",
    });
  },
  function (argv) {
    inquirerPrompt(argv).then((answers) => {
      const { name, type } = answers;
      const isMkdirExists = checkMkdirExists(
        path.resolve(process.cwd(), `./src/pages/${name}/index.js`)
      );
      if (isMkdirExists) {
        console.log(`${name}/index.js文件已经存在`);
        console.log(__filename, "------文件安装路径----");
      } else {
        // copyTemplate(
        //   path.resolve(__dirname, `./template/${type}/index.tpl`),
        //   path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
        //   {
        //     name,
        //   }
        // );
        console.log(
          "下载的项目路径",
          path.join(__dirname, name),
          process.cwd(),
          "当前操作路径",
          path.join(process.cwd(), name)
        );
        //  process.cwd();
        // 下载远程仓库上的代码
        download(
          // "direct:https://github.com/wwLoveWj/nodejs-basic.git#main", // 指定要下载的 Git 仓库，这里是 GitHub 上的 `username/repository`
          "direct:https://github.com/wwLoveWj/nodejs-basic/archive/refs/heads/main.zip#main",
          path.join(process.cwd(), name), // 指定下载的目标目录，这里将下载到当前目录下的 `my-repo` 目录
          // { clone: true }, // 指定要下载的分支或标签，例如 `master` 或 `v1.0.0`
          (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(
                "Repository downloaded from branch or tag successfully"
              );
              install(path.join(__dirname, "my-repo"), answers);
            }
          }
        );
      }
    });
  }
).argv;
