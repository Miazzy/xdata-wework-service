/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const mysqldump = require('mysqldump');
const mysqlconfig = require('../../config/dbconfig');
const dayjs = require('dayjs');

class MySQLController extends Controller {

    /**
     * @function 数据库serialID按时间进行排序
     */
    async updateSerialID() {

        const { ctx, app } = this;

        // 获取表名称
        const tablename = ctx.query.tablename || ctx.params.tablename || '';
        // 设置排序值得字段
        const fieldID = ctx.query.fieldid || ctx.params.fieldid || 'serialid';
        // 进行排序的字段
        const id = ctx.query.id || ctx.params.id || 'id';
        // 具体ID的值
        const value = ctx.query.key || ctx.params.key || ctx.query.value || ctx.params.value || '';
        // 设置返回结果集
        let response = null;

        if (value == '' || value == null) { // 设置排序号 // await app.mysql.query('set @rank= 0;', []); // 执行排序过程
            if (app.config.mysql.procedure) { //启用了存储过程，使用存储过程执行操作
                await app.mysql.query(`call serial_id_seal_update('${tablename}','${fieldID}','${id}');`, []);
                response.affectedRows = response.affectedRows == 0 ? 1 : response.affectedRows;
            } else {
                const ilist = response = await app.mysql.query(`select id from ${tablename} where ${fieldID} is null or ${fieldID} = '' `);
                console.log(JSON.stringify(ilist));
                for (let item of ilist) {
                    const result = await app.mysql.query(`select count(1) v from ${tablename} where ${id} <= '${item.id}'`);
                    console.log(`result:${JSON.stringify(result)}`);
                    const vIndex = result && result.length ? result[0].v : -1;
                    app.mysql.query(`update ${tablename} set ${fieldID} = ${vIndex} where ${id} = '${item.id}' `);
                }
            }
        } else if (value == 'all_table_data' || value == 'all') {
            const ilist = response = await app.mysql.query(`select id from ${tablename} `);
            for (let item of ilist) {
                const result = await app.mysql.query(`select count(1) v from ${tablename} where ${id} <= '${item.id}'`);
                console.log(`result:${JSON.stringify(result)}`);
                const vIndex = result && result.length ? result[0].v : -1;
                app.mysql.query(`update ${tablename} set ${fieldID} = ${vIndex} where ${id} = '${item.id}' `);
            }
        } else {
            response = await app.mysql.query(`select count(1) v from ${tablename} where ${id} <= '${value}'`);
            const vIndex = response && response.length ? response[0].v : -1;
            app.mysql.query(`update ${tablename} set ${fieldID} = ${vIndex} where ${id} = '${value}' `);
            response = response && response.length ? response[0] : { v: -1 };
        }
        ctx.body = response;
    }

    /**
     * @function 将超过N天未领取办公用品的申请状态修改为已完成
     */
    async goodsComplete() {

        const { ctx, app } = this;

        const tablename = ctx.query.tablename || ctx.params.tablename || 'bs_goods_receive'; // 获取表名称
        const field = ctx.query.field || ctx.params.field || 'status'; // 获取表字段
        const oldValue = ctx.query.old || ctx.params.old || '已准备'; // 获取原状态
        const newValue = ctx.query.new || ctx.params.new || '已完成'; // 获取新状态
        const day = ctx.query.day || ctx.params.day || 10; //获取默认天数
        let response = null;
        if (app.config.mysql.procedure) { //启用了存储过程，使用存储过程执行操作
            response = await app.mysql.query(`call goods_complete('${tablename}' , '${field}' , '${oldValue}' , '${newValue}' , ${day} );`, []);
            response.affectedRows = response.affectedRows == 0 ? 1 : response.affectedRows;
        } else {
            response = await app.mysql.query(`update ${tablename} set ${field} = '${newValue}' where status in ('${oldValue}')  and DATE_ADD(create_time , INTERVAL ${day} DAY) < NOW() `);
        }
        ctx.body = response;

    }

    /**
     * @function 数据库更新用印数据ZoneName
     */
    async updateSealZoneName() {
        const { ctx, app } = this;
        // 设置排序号
        const list = await app.mysql.query(`select create_time , userlist_reception id , zonename value from bs_admin_group t where t.groupname like '%SEAL_ADMIN%' order by create_time desc;`, []);
        // 更新表单区域名称
        for (const item of list) {
            app.mysql.query(`update bs_seal_regist set zone_name = '${item.value}' where zone_name is null and seal_group_ids like '%${item.id}%';`, []);
        }
        ctx.body = { success: true };
    }

    /**
     * @function 用印数据定时更新
     */
    async updateSealInfo() {

        const { ctx, app } = this;

        // 执行更新SQL
        app.mysql.query('update bs_seal_regist set front = seal where (front = \'\' or front is null) and seal is not null ; ', []);
        app.mysql.query('update bs_seal_regist set finance = seal where (finance = \'\' or finance is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set record = seal where (record = \'\' or record is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set archive = seal where (archive = \'\' or archive is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set front_name = seal_man where (front_name = \'\' or front_name is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set record_name = seal_man where (record_name = \'\' or record_name is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set finance_name = seal_man where (finance_name = \'\' or finance_name is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set archive_name = seal_man where (archive_name = \'\' or archive_name is null) and seal is not null ;', []);
        app.mysql.query('update bs_seal_regist set serial_id = serialid where serial_id is null;', []);
        app.mysql.query(`update bs_seal_regist set seal_group_ids = 'yanggc,chenll,zhaozy1028' where seal_group_ids like '%yanggc%';`);
        app.mysql.query(`update bs_seal_regist set zone_name = '领地集团总部' where zone_name is null and seal_group_ids like '%yanggc%';`);
        app.mysql.query(`update bs_seal_regist set zone_name = '领悦物业总部' where zone_name is null and seal_group_ids like '%longcl%';`);

        ctx.body = { success: true };
    }

    /**
     * @function 迁移数据
     */
    async moveTableData() {

        const { ctx, app } = this;

        // 获取部门编号
        const tablename = ctx.query.tablename || ctx.params.tablename || ctx.query.tname || ctx.params.tname || '';
        // 获取部门编号
        const historyname = ctx.query.historyname || ctx.params.historyname || ctx.query.hname || ctx.params.hname || '';
        // 获取部门编号
        const field = ctx.query.field || ctx.params.field || 'pid';
        // 获取部门编号
        const value = ctx.query.value || ctx.params.value || '';

        // 执行更新SQL
        const response = await app.mysql.query(`insert into ${historyname} select * from ${tablename} where ${field} = '${value}';`, []);
        await app.mysql.query(`delete from ${tablename} where ${field} = '${value}'`, []);

        ctx.body = response;
    }

    /**
     * @function 数据Row权限更新
     */
    async updateRowLimits() {

        const { ctx, app } = this;

        // 获取表单名称
        const tablename = ctx.query.tablename || ctx.params.tablename || '';
        // 组字段名
        const groupfieldname = ctx.query.groupfieldname || ctx.params.groupfieldname || '';
        // 组字段名
        const fieldname = ctx.query.fieldname || ctx.params.fieldname || '';
        // 获取用户名称
        const username = ctx.query.username || ctx.params.username || '';
        // 获取权限组名
        const ids = ctx.query.ids || ctx.params.ids || '';

        // 执行更新SQL
        const response = await app.mysql.query(`update ${tablename} set ${groupfieldname} = '${ids}'  where ${fieldname} = '${username}' and  ${groupfieldname} != '${ids}';`, []);

        ctx.body = response;
    }

    async backupDatabase() {

        const { ctx } = this;

        // 获取数据库连接信息
        const connectionConfig = {
            host: mysqlconfig.mysql.client.host,
            user: mysqlconfig.mysql.client.user,
            password: mysqlconfig.mysql.client.password,
            database: mysqlconfig.mysql.client.database,
            port: mysqlconfig.mysql.client.port,
        };

        // 数据库Dump配置
        const mysqldumpConfig = {
            connection: connectionConfig,
            dumpToFile: `./mysqldump/${dayjs().format('YYYYMM')}dump.sql.gz`,
            compressFile: true,
        };

        // dump the result straight to a compressed file
        mysqldump(mysqldumpConfig);

        ctx.body = { errcode: 'ok', error: false, success: true };

    }

}


module.exports = MySQLController;