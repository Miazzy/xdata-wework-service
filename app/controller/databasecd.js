/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const sql = require('mssql');
const dbconfig = require('../../config/dbconfig');
const whereHelp = require('../utils/analyzer');

// 设置数据库连接地址
const config = dbconfig.configcd;

/**
 * @abstract 定义数据库相关处理类
 */
class DatabaseController extends Controller {

    /**
     * @function 初始化数据库连接池
     */
    async init() {
        if (this.pool == null || typeof this.pool === 'undefined' || !this.pool) {
            this.pool = await new sql.ConnectionPool(config).connect();
            console.log('connect pool init over ... ');
        }
    }

    /**
     * @function 执行数据库查询操作
     */
    async query() {
        await this.where();
    }

    /**
     * @function 执行数据库查询操作
     */
    async where() {

        await this.init();

        const { ctx, app } = this;
        const query = ctx.query;
        const table = query.table || ctx.params.table;
        const where = query.where || ctx.params.where;
        const order = query.order || query._order || query.orderby || query._orderby || ctx.params.order;
        const fields = query.fields || query._fields;
        const page = query.page || query._page || query._p;
        const size = query.size || query._size || query._s;
        let top = query.top || query._top || query._t || 10000;
        const _where = query._where;

        let wheresql = '';
        let orderby = '';
        let columns = '*';
        let limits = '';

        if (query && !table) {

            ctx.body = ' tablename is null ';

        } else {

            if (query && where) {
                wheresql = ` ${global.atob(where)} `;
            }

            if (query && _where) {
                wheresql = whereHelp.getWhereSQL(_where, ' where ');

                console.log(` wheresql : ${JSON.stringify(wheresql)} `);
            }

            if (query && order) {
                orderby = order.startsWith('-') ? ` order by ${order.slice(1)} desc ` : ` order by ${order} asc `;
            }

            if (query && fields) {
                columns = ` ${fields} `;
            }

            if (!page && !size) {
                top = ` top ${top} `;
            } else {
                top = '';
            }

            if (query && page && size) {
                const offset = page * size + 1;
                const next = (parseInt(page) + 1) * size;
                limits = ` offset ${offset} row fetch next ${next} row only `;
            }

            console.log(` table : ${table} & columns : ${columns} & wheresql : ${wheresql} & orderby : ${orderby}`);

            const sql = ` select ${top} ${columns} from ${config.database}.dbo.${table} ${wheresql} ${orderby} ${limits} `;

            console.log(' sql: ' + sql);

            let result = null;

            result = await app.cache.store('redis').get(sql);

            // 如果数据为空，则查询数据库
            if (!result) {
                result = await this.pool.query(sql);
                await app.cache.store('redis').set(sql, JSON.stringify(result), 10);
            } else {
                result = JSON.parse(result);
                console.log('query sql result :' + result.recordset.length);
            }

            console.log(` sql : ${sql} `);

            ctx.body = result.recordset;
        }

    }

    /**
     * @function 执行数据库查询存在操作
     */
    async exists() {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        const table = query.table || ctx.params.table;
        const page = query.page || query._page || query._p || 0;
        const size = query.size || query._size || query._s || 20;
        const _where = query._where;

        let wheresql = '';
        const orderby = '';
        const columns = '*';
        let limits = '';

        if (query && !table) {

            ctx.body = ' tablename is null ';

        } else {

            if (query && _where) {
                wheresql = whereHelp.getWhereSQL(_where, ' where ');
                console.log(` wheresql : ${JSON.stringify(wheresql)} `);
            }

            if (query && page && size) {
                const offset = page * size + 1;
                const next = (page + 1) * size;
                limits = ` offset ${offset} row fetch next ${next} row `;
            }

            console.log(` table : ${table} & columns : ${columns} & wheresql : ${wheresql} & orderby : ${orderby}`);

            const sql = ` select TOP 1 * from ${config.database}.dbo.${table} ${wheresql} ${orderby} ${limits} `;
            const result = await this.pool.query(sql);

            console.log(` sql : ${sql} `);

            result && result.recordset && result.recordset.length > 0 ? ctx.body = { success: 'true', code: 1099 } : ctx.body = { success: 'false', code: 1001 };
        }

    }

    /**
     * @function 执行数据库新增操作
     */
    async insert() {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        let table = query.table || ctx.params.table;
        let node = query.node || ctx.params.node;

        if (query && table) {
            try {
                table = global.atob(table);
            } catch (error) {
                console.log(error);
            }
        }

        if (query && node) {
            try {
                node = JSON.parse(global.atob(node));
            } catch (error) {
                console.log('JSON.parse(global.atob(node)) : ', error);
            }
        }

        // 遍历node,获取keys字符串和values字符串
        const keys = `(${Object.keys(node).toString()})`; // (column1, column2, column3, ...)
        const values = `(${Object.values(node).toString()})`; // (value1, value2, value3, ...)

        const sql = `INSERT INTO ${config.database}.dbo.${table} ${keys} values ${values} `;

        const result = await this.pool.query(sql);

        console.log(` sql : ${sql} `);

        ctx.body = result;

    }

    /**
     * @function 执行数据库更新操作
     */
    async update() {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        let table = query.table || ctx.params.table;
        let node = query.node || ctx.params.node;
        const _where = query._where;
        let wheresql = null;

        if (query && table) {
            try {
                table = global.atob(table);
            } catch (error) {
                console.log(error);
            }
        }

        if (query && node) {
            try {
                node = JSON.parse(global.atob(node));
            } catch (error) {
                console.log('JSON.parse(global.atob(node)) : ', error);
            }
        }

        if (query && _where) {
            try {
                wheresql = whereHelp.getWhereSQL(_where, ' where ');
            } catch (error) {
                console.log('whereHelp.getWhereSQL(_where, \' where \')', error);
            }
            console.log(` wheresql : ${JSON.stringify(wheresql)} `);
        }

        // SQL执行语句
        let statement = ''; // column1 = value1, column2 = value2, ...
        // SQL执行条件
        const condition = wheresql; // where condition

        // 遍历待更新的对象属性
        Object.entries(node).map(item => {
            statement += ` ${item[0]} = '${item[1]}' ,`;
        });

        // 去掉结尾的逗号
        statement = statement.slice(0, -1);

        const sql = `UPDATE ${config.database}.dbo.${table} SET ${statement} ${condition} ; `;

        const result = await this.pool.query(sql);

        console.log(` sql : ${sql} `);

        ctx.body = result;
    }

    /**
     * @function 执行数据库删除操作
     */
    async delete() {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        let table = query.table || ctx.params.table;
        let node = query.node || ctx.params.node;
        const _where = query._where;
        let wheresql = null;

        if (query && table) {
            try {
                table = global.atob(table);
            } catch (error) {
                console.log(error);
            }
        }

        if (query && node) {
            try {
                node = JSON.parse(global.atob(node));
            } catch (error) {
                console.log('JSON.parse(global.atob(node)) : ', error);
            }
        }

        if (query && _where) {
            try {
                wheresql = whereHelp.getWhereSQL(_where, ' where ');
            } catch (error) {
                console.log('whereHelp.getWhereSQL(_where, \' where \')', error);
            }
            console.log(` wheresql : ${JSON.stringify(wheresql)} `);
        }

        // SQL执行语句
        let statement = ''; // column1 = value1, column2 = value2, ...
        // SQL执行条件
        const condition = wheresql; // where condition

        // 遍历待更新的对象属性
        Object.entries(node).map(item => {
            statement += ` AND ${item[0]} = '${item[1]}' `;
        });

        const sql = `DELETE FROM ${config.database}.dbo.${table} ${condition} ${statement}  ; `;

        const result = await this.pool.query(sql);

        console.log(` sql : ${sql} `);

        ctx.body = result;

    }

    async bulkDelete() {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        const table = query.table || ctx.params.table;
        const ids = query.ids || ctx.params.ids;
        const column = query.column || ctx.params.column;
        const sql = `DELETE FROM ${table} WHERE ${column} IN ( ${ids} )`;
        const result = await this.pool.query(sql);
        console.log(` sql : ${sql} `);

        ctx.body = result;
    }

    async bulkRead(req, res) {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        const table = query.table || ctx.params.table;
        const ids = query.ids || ctx.params.ids;
        const column = query.column || ctx.params.column;
        const fields = query.fields || query._fields;
        const sql = `SELECT ${fields} FROM ${table} WHERE ${column} IN ( ${ids} )`;
        const result = await this.pool.query(sql);
        console.log(` sql : ${sql} `);

        ctx.body = result.recordset;

    }

    async count(req, res) {

        await this.init();

        const { ctx } = this;
        const query = ctx.query;
        const table = query.table || ctx.params.table;
        const _where = query._where;

        let wheresql = '';

        if (query && _where) {
            wheresql = whereHelp.getWhereSQL(_where, ' where ');
            console.log(` wheresql : ${JSON.stringify(wheresql)} `);
        }

        const sql = `SELECT COUNT(1) AS no_of_rows FROM ${table} ${wheresql} `;

        const result = await this.pool.query(sql);

        console.log(` sql : ${sql} `);

        ctx.body = result.recordset;

    }

    /**
     * @function 查询所有员工数据，并保持至数据库中
     * @param {*} req
     * @param {*} res
     */
    async employee(req, res) {
        const { ctx } = this;
        // 查询所有用户数据
        const userlist = await this.queryEmployeeAll();
        // 返回用户数据集
        ctx.body = userlist;
    }

    /**
     * @function 查询员工数据（通过员工ID）
     * @param {*} req
     * @param {*} res
     */
    async queryEmployeeByID(req, res) {

        const { ctx, app } = this;
        const id = ctx.query.id || ctx.params.id;

        // 缓存控制器
        const store = app.cache.store('redis');
        // 查询用户信息
        const user = (await store.get(`wxConfig.enterpriseCD.user.sysuserinfo#id@${id}`)) || (await store.get(`wxConfig.enterpriseCD.user.sysuserinfo@${id}`));
        // 返回用户信息
        ctx.body = user;
    }

    /**
     * @function 查询所有员工数据，并保持至数据库中
     */
    async queryEmployeeAll() {

        await this.init();

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        const sql = `select id , dsporder wid , loginid username , lastname realname , sex , mobile , joblevel level, textfield1 , certificatenum cert, status from ${config.database}.dbo.hrmresource  where (status != 5) and (loginid != '')  order by id asc  offset 0 row fetch next 10000 row  only `;

        console.log(sql);

        // 获取动态token
        const userlist = await store.get(`wxConfig.enterpriseCD.user.systemuserlist#sort#@${sql}`);

        if (userlist) {
            return JSON.parse(userlist);
        }

        const result = await this.pool.query(sql);

        // 遍历数据，每个用户ID，存一个用户信息
        result.recordset.map(item => {
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#id@${item.id}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#wid@${item.wid}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo@${item.username}`, JSON.stringify(item), 3600 * 24 * 31);
            return true;
        });

        const list = result.recordset.sort((n1, n2) => {
            try {
                return n1.username.localeCompare(n2.username);
            } catch (error) {
                return n1.id - (n2.id);
            }
        });

        await store.set(`wxConfig.enterpriseCD.user.systemuserlist#sort#@${sql}`, JSON.stringify(list), 3600 * 24 * 3);

        return list;

    }

    /**
     * @function 查询所有员工数据，并保持至数据库中
     */
    async queryEmployeeByWID() {

        const { ctx, app } = this;
        const id = ctx.query.id || ctx.params.id;

        // 设置返回结果
        this.ctx.body = await this.ctx.service.bussinesscd.queryEmployeeByID(id);
    }

}

module.exports = DatabaseController;