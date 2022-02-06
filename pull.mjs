#!/usr/bin/env zx
"use strict";

// zx pull.mjs
// zx pull.mjs --entry '.'
// zx pull.mjs --entry './'
// zx pull.mjs --entry 'work'

/**
 * @param {string} folder
 *
 * @returns {boolean}
 */
function isGitFolder(folder) {
  const children = fs.readdirSync(folder);
  if (!children.length) {
    return false;
  }

  for (const child of children) {
    if (child === ".git") {
      return fs.statSync(path.resolve(folder, child)).isDirectory();
    }
  }

  return false;
}

// 获取入口指定，默认当前目录
let entry = ".";
if (argv.entry) {
  entry = argv.entry;

  if (!path.isAbsolute(entry)) {
    entry = path.resolve(".", entry);
  }
}
// 枚举当前目录下的所有文件夹
const childrenName = fs.readdirSync(entry);
for (const child of childrenName) {
  const childPath = path.resolve(entry, child);
  const stats = fs.statSync(childPath);
  if (!stats.isDirectory()) {
    break;
  }

  if (isGitFolder(childPath)) {
    // @todo 处理window下路径转换问题
    const bashPath = "/" + childPath.replace(":/", "/");
    await $`cd ${bashPath} && git fetch --prune --prune-tags --all --tags --verbose`;
  } else {
    // @todo 递归
  }
}

export {};
