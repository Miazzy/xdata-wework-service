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
            this.pool = await new mssql.ConnectionPool(dbconfig).connect();
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
        const userinfo = await store.get(`wxConfig.enterprise.grouplimits.username@${username}`);

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
        await store.set(`wxConfig.enterprise.grouplimits.username@${username}`, result, 3600 * 24 * 3);

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
        const userinfo = await store.get(`wxConfig.enterprise.grouplimits.username#userid#v1#@${username}`);

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
        await store.set(`wxConfig.enterprise.grouplimits.username#userid#v1#@${username}`, result, 3600 * 24 * 3);

        // 设置返回结果
        return result;
    }

    /**
     * @function 查询企业微信员工数据通过联系号码
     * @param {*} mobile
     */
    async queryWeWorkUserByMobile(mobile) {

        const { ctx, app } = this;

        console.log(`queryWeWorkUserByMobile:${mobile}`);

        // 获取部门编号
        const company = ctx.query.company || ctx.params.company || '融量';

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.user.mobile.queryuserinfo@${mobile}`);

        // 如果获取到缓存数据，设置返回结果
        if (userinfo) {
            return userinfo;
        }

        const sql = ` select * from bs_wework_user where mobile = '${mobile}' and company = '${company}'  ; `;
        const result = await app.mysql.query(sql, []);
        console.log(`mobile:${mobile},userinfo:${JSON.stringify(result)},sql:${sql}`);

        // 设置缓存
        await store.set(`wxConfig.wework.user.mobile.queryuserinfo@${mobile}`, result, wxConfig.timestamp.ONE_DAY);

        // 设置返回结果
        return result;

    }

    /**
     * @function 查询企业微信员工数据通过联系号码
     * @param {*} username
     */
    async queryWeWorkUserByUserName(username) {

        const { ctx, app } = this;

        console.log(`queryWeWorkUserByUserName:${username}`);

        // 获取部门编号
        const company = ctx.query.company || ctx.params.company || '融量';

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.user.username.queryuserinfo@${username}`);

        // 如果获取到缓存数据，设置返回结果
        if (userinfo) {
            return userinfo;
        }

        const sql = ` select * from v_hrmresource where (loginid = '${username}' or userid = '${username}' ) and cname = '${company}'  ; `;
        const result = await app.mysql.query(sql, []);
        console.log(`username:${username},userinfo:${JSON.stringify(result)},sql:${sql}`);

        // 设置缓存
        await store.set(`wxConfig.wework.user.username.queryuserinfo@${username}`, result, wxConfig.timestamp.ONE_DAY);

        // 设置返回结果
        return result;

    }

    /**
     * @function 查询企业微信员工数据通过联系号码
     * @param {*} username
     * @param {*} mobile
     * @param {*} certno
     */
    async queryUserInfoByUserMobileCertNO(username, mobile, certno) {

        const { ctx, app } = this;

        console.log(`queryWeWorkUserByUserName:${username},${mobile},${certno}`);

        // 获取部门编号
        const company = ctx.query.company || ctx.params.company || '融量';

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.user.username.mobile.certno.queryUserInfoByUserMobileCertNO@${username}@${mobile}@${certno}`);

        // 如果获取到缓存数据，设置返回结果
        if (userinfo) {
            return userinfo;
        }

        const sql = ` select * from v_hrmresource where (loginid = '${username}' or userid = '${username}' ) and mobile = '${mobile}' and cert like '%${certno}' and cname = '${company}'  ; `;
        const result = await app.mysql.query(sql, []);
        console.log(`username,mobile,certno:${username},${mobile},${certno},userinfo:${JSON.stringify(result)},sql:${sql}`);

        // 设置缓存
        await store.set(`wxConfig.wework.user.username.mobile.certno.queryUserInfoByUserMobileCertNO@${username}@${mobile}@${certno}`, result, wxConfig.timestamp.ONE_DAY);

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

        const conditionSQL = `( id = '${id}' ` + (name ? `and lastname = '${name}' ) ` : ' ) ') + (mobile ? ` or mobile = '${mobile}' ` : ' ');
        console.log('conditionsql : ' + conditionSQL);
        const sql = `select id , dsporder wid , loginid username , lastname realname , sex , mobile , joblevel level, textfield1 , certificatenum cert, status from newecology.dbo.hrmresource  where (status != 5) and  ( ${conditionSQL} ) order by id asc offset 0 row fetch next 10000 row  only  `;
        console.log('queryEmployeeByID sql : ' + sql);
        const result = await this.pool.query(sql);

        console.log('queryEmployeeByID result : ' + JSON.stringify(result));

        // 遍历数据，每个用户ID，存一个用户信息
        result.recordset.map(item => {
            store.set(`wxConfig.enterprise.user.sysuserinfo#id@${item.id}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterprise.user.sysuserinfo#wid@${item.wid}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterprise.user.sysuserinfo@${item.username}`, JSON.stringify(item), 3600 * 24 * 31);
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

        const sql = `select id , dsporder wid , loginid username , lastname realname , sex , mobile , joblevel level, textfield1 , certificatenum cert, status from newecology.dbo.hrmresource  where (status != 5) and  ( mobile = '${mobile}' )order by id asc offset 0 row fetch next 10000 row  only  `;

        console.log('queryEmployeeByID sql : ' + sql);

        const result = await this.pool.query(sql);

        console.log('queryEmployeeByID result : ' + JSON.stringify(result));

        // 遍历数据，每个用户ID，存一个用户信息
        result.recordset.map(item => {
            store.set(`wxConfig.enterprise.user.sysuserinfo#id@${item.id}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterprise.user.sysuserinfo#wid@${item.wid}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterprise.user.sysuserinfo#mobile@${mobile}`, JSON.stringify(item), 3600 * 24 * 31);
            store.set(`wxConfig.enterprise.user.sysuserinfo@${item.username}`, JSON.stringify(item), 3600 * 24 * 31);
            return true;
        });

        return result.recordset[0];

    }

    async queryUserInfoByID(userid) {

        const { app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get(`wxConfig.enterprise.user.userinfo@${userid}`);

        // 如果获取到用户信息，则直接返回数据
        if (userinfo) {
            return JSON.parse(userinfo);
        }

        // 获取token
        const token = await this.queryToken();
        // 获取URL
        const queryURL = wxConfig.enterprise.user.queryAPI.replace('ACCESS_TOKEN', token).replace('USERID', userid);
        // 获取返回结果
        const result = await axios.get(queryURL);
        // 保存用户信息
        store.set(`wxConfig.enterprise.user.userinfo@${userid}`, JSON.stringify(result.data), 3600 * 24 * 3);

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
        const userinfo = await store.get(`wxConfig.enterprise.user.userinfo#mobile#@${mobile}`);

        // 如果获取到用户信息，则直接返回数据
        if (userinfo) {
            return JSON.parse(userinfo);
        }

        // 获取token
        const token = await this.queryToken();
        // 获取URL
        const queryURL = wxConfig.enterprise.user.queryDepartUserAPI.replace('ACCESS_TOKEN', token).replace('DEPARTMENT_ID', 1019).replace('FETCH_CHILD', 1);

        console.log(queryURL);

        // 获取返回结果
        const result = await axios.get(queryURL);

        console.log(`result : ${JSON.stringify(result.data.userlist.length)}`);

        // 遍历数据，每个用户ID，存一个用户信息
        result.data.userlist.map(item => {
            response = item.mobile === mobile ? item : {};
            store.set(`wxConfig.enterprise.user.userinfo#mobile#@${item.mobile}`, JSON.stringify(item), 3600 * 24 * 3);
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
        const userinfo = await store.get(`wxConfig.enterprise.department.single@${departid}`);

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
        const queryURL = wxConfig.enterprise.department.queryALL.replace('ACCESS_TOKEN', token) + params;
        // 获取返回结果
        const result = await axios.get(queryURL);
        // 保存用户信息
        store.set(`wxConfig.enterprise.department.queryALL@${departid}`, JSON.stringify(result.data), 3600 * 24 * 3);

        // 遍历数据，每个用户ID，存一个用户信息
        result.data.department.map(item => {
            return store.set(`wxConfig.enterprise.department.single@${item.id}`, JSON.stringify(item), 3600 * 24 * 3);
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
        const agentid = query.agentid || ctx.params.agentid || wxConfig.enterprise.agentid;

        // 获取TokenURL
        const tokenAPI = `${wxConfig.enterprise.message.gettoken}?corpid=${wxConfig.enterprise.id}&corpsecret=${wxConfig.enterprise.agent[agentid]}`;
        // 获取动态token
        let token = await store.get(`wxConfig.enterprise.access_token@${agentid}`);

        // 检查token是否存在，如果不存在，则刷新token
        if (!token) {
            const result = await axios.get(tokenAPI);
            token = result.data.access_token;
            store.set(`wxConfig.enterprise.access_token@${agentid}`, token, 3600);
            console.log('get token from wechat rest api :' + token);
        } else {
            // 打印token值
            console.log('get token from redis :' + token);
        }

        return token;
    }

}


module.exports = BussinessService;