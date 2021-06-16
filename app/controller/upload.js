/* eslint-disable indent */
'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');

const fileUtils = require('../utils/fileUtils.js');
const fileLocation = 'app/public/upload';

class UploadController extends Controller {

    // 上传单个文件。如果在同一个文件夹中上传相同的文件，新文件会将源文件覆盖掉。
    async upload() {

        const { ctx } = this;

        fileUtils.createFolderByDirname(fileLocation);

        const stream = await ctx.getFileStream();
        const filename = encodeURIComponent(stream.fields.name) + path.extname(stream.filename).toLowerCase();
        console.log('filename: ' + filename);
        const serviceFileName = stream.filename;

        // 拼装服务端文件名
        const target = path.join(this.config.baseDir, fileLocation, serviceFileName);
        const writeStream = fs.createWriteStream(target);
        await pump(stream, writeStream);

        const fileUrl = fileLocation + '/' + serviceFileName;

        this.ctx.body = { success: 'success', fileUrl };
    }

    async multi_upload() {

        fileUtils.createFolderByDirname(fileLocation);
        const parts = this.ctx.multipart({ autoFields: true });
        const files = [];
        let stream;

        while ((stream = await parts()) != null) {
            const filename = stream.filename.toLowerCase();
            const target = path.join(this.config.baseDir, fileLocation, filename);
            const writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);
            files.push(filename);
        }

        this.ctx.body = { success: 'muti upload success' };
    }


}

module.exports = UploadController;