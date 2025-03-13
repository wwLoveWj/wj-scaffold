#!/usr/bin/env node

const yargs = require("yargs");
const path = require("path");
const { inquirerPrompt } = require("./inquirer");
const { copyDir } = require("./copy");
// copyFile 和 copyDir 使用的区别在参数，copyFile 要求参数 from 和参数 to 都精确到文件路径。

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
      } else {
        copyFile(
          path.resolve(__dirname, `./template/${type}/index.js`),
          path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
          {
            name,
          }
        );
      }
    });
  }
).argv;
