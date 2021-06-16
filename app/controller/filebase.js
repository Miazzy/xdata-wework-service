/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const compressing = require('compressing');
const fs = require('fs');
const fileConfig = require('../../config/fileconfig');

const sql = require('mssql');
const dbconfig = require('../../config/dbconfig');

// 设置数据库连接地址
const config = dbconfig;

/**
 * @abstract 定义数据库相关处理类
 */
class FileBaseController extends Controller {

    /**
     * @function 初始化数据库连接池
     */
    async init() {
        if (this.pool == null || typeof this.pool === 'undefined' || !this.pool) {
            this.pool = await new sql.ConnectionPool(config).connect();
            console.log('connect pool init over ... ');
        }
    }

    async query() {

        const { ctx } = this;

        const query = ctx.query;
        let file = query.file || ctx.params.file;
        let path = query.path || ctx.params.path;

        try {
            file = global.atob(file);
            path = global.atob(path);
        } catch (error) {
            console.log(' base64 decode error ', error);
        }

        const unzipfile = path.slice(0, -4);
        const filename = `${fileConfig.path}/unzip/${unzipfile}`;
        const filepath = filename.slice(0, filename.lastIndexOf('/'));

        console.log(`filename: ${filename}`);
        console.log(`filepath: ${path}`);
        console.log(`filepath: ${filepath}`);

        await compressing.zip.uncompress(`${fileConfig.path}/${path}`, `${filepath}`);

        const fileSize = fs.statSync(filename).size;

        ctx.attachment(filename, {
            fallback: true,
            type: 'attachment', // [string] attachment/inline
        });
        ctx.set('Content-Length', fileSize);
        ctx.set('Content-Disposition', `attachment; filename=${file}`);
        ctx.body = fs.createReadStream(filename);

    }

    async queryByFileID() {

        const { ctx } = this;

        await this.init();

        const query = ctx.query;
        const fileID = query.file || ctx.params.file;
        const sql = `select imagefileid id , imagefilename name , TokenKey path from ${config.database}.dbo.ImageFile where imagefileid = ${fileID};`;

        console.log('fileID : ' + fileID);

        const result = await this.pool.query(sql);

        console.log(JSON.stringify(result));

        const file = result.recordset[0].name;
        const path = result.recordset[0].path.replace('.wfile', '.zip');

        console.log(JSON.stringify({ file, path }));

        const unzipfile = path.slice(0, -4);
        const filename = `${fileConfig.path}/unzip/${unzipfile}`;
        const filepath = filename.slice(0, filename.lastIndexOf('/'));

        console.log(`filename: ${filename}`);
        console.log(`filepath: ${path}`);
        console.log(`filepath: ${filepath}`);
        console.log(`file origin: ${fileConfig.path}/${path}`);

        await compressing.zip.uncompress(`${fileConfig.path}/${path}`, `${filepath}`);

        const fileSize = fs.statSync(filename).size;

        ctx.attachment(filename, {
            fallback: true,
            type: 'attachment', // [string] attachment/inline
        });
        ctx.set('Content-Length', fileSize);
        ctx.set('Content-Disposition', `attachment; filename=${global.encodeURIComponent(file)}`);
        ctx.body = fs.createReadStream(filename);

    }

}

module.exports = FileBaseController;