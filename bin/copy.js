const copydir = require("copy-dir");
const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (e) {
    mkdirp(target);
    function mkdirp(dir) {
      if (fs.existsSync(dir)) {
        return true;
      }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

function copyDir(form, to, options) {
  mkdirGuard(to);
  copydir.sync(form, to, options);
}

function checkMkdirExists(path) {
  return fs.existsSync(path);
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);

  mkdirGuard(parentPath);

  fs.writeFileSync(to, buffer);
}

/**
 *
 * @param {*} path  动态模板文件的相对路径
 * @param {*} data  动态模板文件的配置数据
 * @returns
 */
// 使用readTemplate 方法来读取这个 index.tpl 动态模板文件内容
function readTemplate(path, data = {}) {
  const str = fs.readFileSync(path, { encoding: "utf8" });
  return Mustache.render(str, data);
}

function copyTemplate(from, to, data = {}) {
  // path.extname(from) 返回文件扩展名，比如 path.extname(index.tpl) 返回 .tpl。
  if (path.extname(from) !== ".tpl") {
    return copyFile(from, to);
  }
  const parentToPath = path.dirname(to);
  mkdirGuard(parentToPath);
  fs.writeFileSync(to, readTemplate(from, data));
}

exports.copyTemplate = copyTemplate;
exports.readTemplate = readTemplate;
exports.copyFile = copyFile;
// 链接：https://juejin.cn/post/7260144602471776311
exports.checkMkdirExists = checkMkdirExists;
exports.mkdirGuard = mkdirGuard;
exports.copyDir = copyDir;
