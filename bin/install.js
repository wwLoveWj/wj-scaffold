const path = require("path");
const { exec } = require("child_process");

const LibraryMap = {
  "Ant Design": "antd",
  iView: "view-ui-plus",
  "Ant Design Vue": "ant-design-vue",
  Element: "element-plus",
};

function install(cmdPath, options) {
  const { frame, library } = options;
  const command = `yarn add ${frame} && yarn add ${LibraryMap[library]}`;
  return new Promise(function (resolve, reject) {
    exec(
      command,
      {
        cwd: path.resolve(cmdPath),
      },
      function (error, stdout, stderr) {
        console.log("error", error);
        console.log("stdout", stdout);
        console.log("stderr", stderr);
      }
    );
  });
}

exports.install = install;
