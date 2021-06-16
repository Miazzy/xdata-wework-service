/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const mssql = require('mssql');
const dbconfig = require('../../config/dbconfig');
const wxConfig = require('../../config/wxconfig');
const axios = require('axios');
const Service = require('egg').Service;

class BussinessService extends Service {

    /**
     * @function 初始化数据库连接池
     */
    async init() {
        if (this.pool == null || typeof this.pool === 'undefined' || !this.pool) {
            this.pool = await new mssql.ConnectionPool(dbconfig.configcd).connect();
            console.log('connect pool init over ... ');
        }
    }

    /**
     * @function 获取用户管理组信息
     * @param {*} username
     */
    async queryGroupLimits(username) {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterpriseCD.grouplimits.username@${username}`);

        // 如果获取到缓存数据，设置返回结果
        if (userinfo) {
            return userinfo;
        }

        // 构建查询SQL
        const sealmansql = ` select distinct seal_man from bs_seal_regist where seal_man is not null and seal_man != '' and seal_man like '%${username}%'  ; `;
        const frontmansql = ` select distinct front_name from bs_seal_regist where front_name is not null and front_name != '' and front_name like '%${username}%'  ; `;
        const archivemansql = ` select distinct archive_name from bs_seal_regist where archive_name is not null and archive_name != '' and archive_name like '%${username}%'  ; `;

        // 查询印章人员
        const seal = await app.mysql.query(sealmansql, []);
        // 查询前端人员
        const front = await app.mysql.query(frontmansql, []);
        // 查询前端人员
        const archive = await app.mysql.query(archivemansql, []);
        // 设置结果
        const result = { seal, front, archive };
        // 设置缓存
        await store.set(`wxConfig.enterpriseCD.grouplimits.username@${username}`, result, 3600 * 24 * 3);

        // 设置返回结果
        return result;
    }

    /**
     * @function 获取用户管理组信息
     * @param {*} username
     */
    async queryGroupLimitsByID(username) {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterpriseCD.grouplimits.username#userid#v1#@${username}`);

        // 如果获取到缓存数据，设置返回结果
        if (userinfo) {
            return userinfo;
        }

        // 构建查询SQL
        const sealmansql = ` select distinct seal from bs_seal_regist where seal is not null and seal != '' and seal like '%${username}%'  ; `;
        const frontmansql = ` select distinct front from bs_seal_regist where front is not null and front != '' and front like '%${username}%'  ; `;
        const archivemansql = ` select distinct archive from bs_seal_regist where archive is not null and archive != '' and archive like '%${username}%'  ; `;

        // 查询印章人员
        const seal = await app.mysql.query(sealmansql, []);
        // 查询前端人员
        const front = await app.mysql.query(frontmansql, []);
        // 查询前端人员
        const archive = await app.mysql.query(archivemansql, []);
        // 设置结果
        const result = { seal, front, archive };
        // 设置缓存
        await store.set(`wxConfig.enterpriseCD.grouplimits.username#userid#v1#@${username}`, result, 3600 * 24 * 3);

        // 设置返回结果
        return result;
    }

    /**
     * @function 查询所有员工数据，并保持至数据库中
     * @param {*} id
     * @param {*} name
     * @param {*} mobile
     */
    async queryEmployeeByID(id, name, mobile) {

        await this.init();

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        console.log('queryEmployeeByID userid : ' + id);

        const sql = `select id , dsporder wid , loginid username , lastname realname , sex , mobile , joblevel level, textfield1 , certificatenum cert, status from ecology.dbo.hrmresource  where (status != 5) and  (id = ${id} or lastname = '${name}' or mobile = '${mobile}' )order by id asc offset 0 row fetch next 10000 row  only  `;

        console.log('queryEmployeeByID sql : ' + sql);

        const result = await this.pool.query(sql);

        console.log('queryEmployeeByID result : ' + JSON.stringify(result));

        // 遍历数据，每个用户ID，存一个用户信息
        result.recordset.map(item => {
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#id@${item.id}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#wid@${item.wid}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo@${item.username}`, JSON.stringify(item), 3600 * 24 * 31);
            return true;
        });

        return result.recordset[0];

    }

    /**
     * @function 查询所有员工数据，并保持至数据库中
     * @param {*} mobile
     */
    async queryEmployeeByMobile(mobile) {

        await this.init();

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        const sql = `select id , dsporder wid , loginid username , lastname realname , sex , mobile , joblevel level, textfield1 , certificatenum cert, status from ecology.dbo.hrmresource  where (status != 5) and  ( mobile = '${mobile}' )order by id asc offset 0 row fetch next 10000 row  only  `;

        console.log('queryEmployeeByID sql : ' + sql);

        const result = await this.pool.query(sql);

        console.log('queryEmployeeByID result : ' + JSON.stringify(result));

        // 遍历数据，每个用户ID，存一个用户信息
        result.recordset.map(item => {
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#id@${item.id}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#wid@${item.wid}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo#mobile@${mobile}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterpriseCD.user.sysuserinfo@${item.username}`, JSON.stringify(item), 3600 * 24 * 31);
            return true;
        });

        return result.recordset[0];

    }

    async queryUserInfoByID(userid) {

        const { app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterpriseCD.user.userinfo@${userid}`);

        // 如果获取到用户信息，则直接返回数据
        if (userinfo) {
            return JSON.parse(userinfo);
        }

        // 获取token
        const token = await this.queryToken();
        // 获取URL
        const queryURL = wxConfig.enterpriseCD.user.queryAPI.replace('ACCESS_TOKEN', token).replace('USERID', userid);
        // 获取返回结果
        const result = await axios.get(queryURL);
        // 保存用户信息
        store.set(`wxConfig.enterpriseCD.user.userinfo@${userid}`, JSON.stringify(result.data), 3600 * 24 * 3);

        // 设置返回信息
        return result.data;

    }

    async queryUserInfoByMobile(mobile) {

        const { app } = this;

        // 设置返回结果
        let response = null;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterpriseCD.user.userinfo#mobile#@${mobile}`);

        // 如果获取到用户信息，则直接返回数据
        if (userinfo) {
            return JSON.parse(userinfo);
        }

        // 获取token
        const token = await this.queryToken();
        // 获取URL
        const queryURL = wxConfig.enterpriseCD.user.queryDepartUserAPI.replace('ACCESS_TOKEN', token).replace('DEPARTMENT_ID', 1019).replace('FETCH_CHILD', 1);

        console.log(queryURL);

        // 获取返回结果
        const result = await axios.get(queryURL);

        console.log(`result : ${JSON.stringify(result.data.userlist.length)}`);

        // 遍历数据，每个用户ID，存一个用户信息
        result.data.userlist.map(item => {
            response = item.mobile === mobile ? item : {};
            store.set(`wxConfig.enterpriseCD.user.userinfo#mobile#@${item.mobile}`, JSON.stringify(item), 3600 * 24 * 3);
        });

        // 如果获取到返回信息
        if (response) {
            // 获取用户信息
            const user = await this.queryEmployeeByMobile(mobile);
            response.systemuserinfo = user;
            response.username = user.username;
            response.grouplimits = await this.queryGroupLimitsByID(user.username); // 用户管理组权限
        }

        return response;
    }

    /**
     * @function 查询部门信息
     * @param {*} departid
     */
    async queryDepartmentByID(departid) {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        // 查询参数
        let params = '';
        // 部门编号
        departid = departid === '-1' ? '' : departid;

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterpriseCD.department.single@${departid}`);

        if (departid) {
            params = `&id=${departid}`;
        }

        console.log(` departid : ${departid} params : ${params}`);

        if (userinfo) {
            // console.log(` userinfo : ${userinfo}`);
            return JSON.parse(userinfo);
        }

        // 获取token
        const token = await this.queryToken();
        // 获取URL
        const queryURL = wxConfig.enterpriseCD.department.queryALL.replace('ACCESS_TOKEN', token) + params;
        // 获取返回结果
        const result = await axios.get(queryURL);
        // 保存用户信息
        store.set(`wxConfig.enterpriseCD.department.queryALL@${departid}`, JSON.stringify(result.data), 3600 * 24 * 3);

        // 遍历数据，每个用户ID，存一个用户信息
        result.data.department.map(item => {
            return store.set(`wxConfig.enterpriseCD.department.single@${item.id}`, JSON.stringify(item), 3600 * 24 * 3);
        });

        const resp = result.data.department.find(item => {
            return item.id === departid;
        });

        console.log(`departid : ${departid} #resp: ${JSON.stringify(resp)}`);

        // 设置返回信息
        return resp;

    }

    /**
     * @function 获取企业微信token
     */
    async queryToken() {

        const { ctx, app } = this;

        await this.init();

        // 缓存控制器
        const store = app.cache.store('redis');

        const query = ctx.query;
        const agentid = query.agentid || ctx.params.agentid || wxConfig.enterpriseCD.agentid;

        // 获取TokenURL
        const tokenAPI = `${wxConfig.enterpriseCD.message.gettoken}?corpid=${wxConfig.enterpriseCD.id}&corpsecret=${wxConfig.enterpriseCD.agent[agentid]}`;
        // 获取动态token
        let token = await store.get(`wxConfig.enterpriseCD.access_token@${agentid}`);

        // 检查token是否存在，如果不存在，则刷新token
        if (!token) {
            const result = await axios.get(tokenAPI);
            token = result.data.access_token;
            store.set(`wxConfig.enterpriseCD.access_token@${agentid}`, token, 3600);
            console.log('get token from wechat rest api :' + token);
        } else {
            // 打印token值
            console.log('get token from redis :' + token);
        }

        return token;
    }

}


module.exports = BussinessService;