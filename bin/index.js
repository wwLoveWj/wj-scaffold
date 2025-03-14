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
        console.log(__filename, "ppo----------");
      } else {
        // copyTemplate(
        //   path.resolve(__dirname, `./template/${type}/index.tpl`),
        //   path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
        //   {
        //     name,
        //   }
        // );
        console.log("下载中", path.join(__dirname, "my-repo"), process.cwd());
        download(
          // "direct:https://github.com/wwLoveWj/nodejs-basic.git#main", // 指定要下载的 Git 仓库，这里是 GitHub 上的 `username/repository`
          "direct:https://github.com/wwLoveWj/nodejs-basic/archive/refs/heads/main.zip#main",
          //   "destination-folder",
          path.join(__dirname, "my-repo"), // 指定下载的目标目录，这里将下载到当前目录下的 `my-repo` 目录
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
