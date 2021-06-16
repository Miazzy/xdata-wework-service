/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const sql = require('mssql');

const dbconfig = require('../../config/dbconfig');

// 设置数据库连接地址
const config = dbconfig;


/**
 * @abstract 定义数据库相关处理类
 */
class RedisController extends Controller {

    /**
     * @function 初始化数据库连接池
     */
    async init() {
        if (this.pool == null || typeof this.pool === 'undefined' || !this.pool) {
            this.pool = await new sql.ConnectionPool(config).connect();
            console.log('connect pool init over ... ');
        }
    }

    async set() {
        const { ctx, app } = this;
        const store = app.cache.store('redis'); // 缓存控制器
        ctx.body = store.get('key');
    }

    async get() {
        const { ctx, app } = this;
        const store = app.cache.store('redis'); // 缓存控制器
        ctx.body = store.get('key');
    }

}

module.exports = RedisController;