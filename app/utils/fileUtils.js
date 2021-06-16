/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const fs = require('fs');
const path = require('path');


// 递归根据目录创建文件夹，可以同时创建一串目录下所有文件夹。
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
}

// 根据路径名递归创建文件名
exports.createFolderByDirname = dirname => {
    mkdirsSync(dirname);
};