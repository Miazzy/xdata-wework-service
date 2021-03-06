/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const sql = require('mssql');
const defaultConfig = require('./config.default')();

// 数据库连接池配置
const pool = {
    min: 0,
    max: 10,
    idleTimeoutMillis: 3000,
};

// 数据库options
const options = {
    encrypt: false,
    enableArithAbort: false,
}

// 泛微OA数据库链接配置(领地公司)
const config = {
    user: defaultConfig.mssql.clients.db1.user,
    password: defaultConfig.mssql.clients.db1.password,
    server: defaultConfig.mssql.clients.db1.server,
    database: defaultConfig.mssql.clients.db1.database,
    port: parseInt(defaultConfig.mssql.clients.db1.port),
    options,
    pool,
};

// 泛微OA数据库链接配置(创达公司)
const configcd = {
    user: defaultConfig.mssql.clients.db2.user,
    password: defaultConfig.mssql.clients.db2.password,
    server: defaultConfig.mssql.clients.db2.server,
    database: defaultConfig.mssql.clients.db2.database,
    port: parseInt(defaultConfig.mssql.clients.db2.port),
    options,
    pool,
};



// MySQL数据库连接配置(Jeecg-Boot)
const mysql = {
    client: {
        host: defaultConfig.mysql.client.host,
        port: defaultConfig.mysql.client.port,
        user: defaultConfig.mysql.client.user,
        password: defaultConfig.mysql.client.password,
        database: defaultConfig.mysql.client.database,
    },
    app: true,
    agent: false,
};

/**
 * @function 初始化数据库连接池
 */
const init = async() => {
    if (global.mssqlpool == null || typeof global.mssqlpool === 'undefined' || !this.mssqlpool) {
        global.mssqlpool = {};
        global.mssqlpool.default = await new sql.ConnectionPool(config).connect();
        global.mssqlpool.cd = await new sql.ConnectionPool(configcd).connect();
        console.log('connect pool init over ... ');
    }
};

module.exports = {
    ...config,
    config,
    configcd,
    mysql,
    init,
};