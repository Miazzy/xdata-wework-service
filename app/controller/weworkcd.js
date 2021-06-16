/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const sql = require('mssql');

const dayjs = require('dayjs');
const superagent = require('superagent');

const fileConfig = require('../../config/fileconfig');
const wxConfig = require('../../config/wxconfig');
const dbconfig = require('../../config/dbconfig');

const tools = require('../utils/tools');

// 设置数据库连接地址
const config = dbconfig.configcd;

/**
 * @abstract 定义数据库相关处理类 创达公司企业微信
 */
class WeworkCDController extends Controller {

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
     * @function 发送群机器人消息
     */
    async send() {

        const { ctx } = this;

        const query = ctx.query;
        const title = query.title || ctx.params.title;
        const description = query.description || ctx.params.description;
        const id = query.id || ctx.params.id;
        const userid = query.userid || ctx.params.userid;
        const redirectUrl = query.rurl || ctx.params.rurl;
        const type = query.type || ctx.params.type;
        const flag = redirectUrl.includes('?') ? '&' : '?';
        const url = redirectUrl + `${flag}id=${id}&userid=${userid}`;

        const messageurl = {
            ...fileConfig,
        };

        console.log(url);

        const node = {
            msgtype: 'news',
            news: {
                articles: [{
                    title,
                    description,
                    url,
                    picurl: fileConfig.imageurl,
                }],
            },
        };

        const result = await axios.post(messageurl[type], node);

        ctx.body = result.data;
    }

    /**
     * @function 获取添加微信跳转的URL
     * @param {*} redirectUrl
     */
    queryRedirectURL(redirectUrl) {
        try {
            if (redirectUrl && !redirectUrl.includes('open.weixin.qq.com')) {
                redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxConfig.enterpriseCD.id}&response_type=code&scope=snsapi_base&state=STATE&redirect_uri=REDIRECT_URL#wechat_redirect`.replace('REDIRECT_URL', encodeURIComponent(redirectUrl));
            }
        } catch (error) {
            if (redirectUrl && !redirectUrl.includes('open.weixin.qq.com')) {
                redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxConfig.enterpriseCD.id}&response_type=code&scope=snsapi_base&state=STATE&redirect_uri=REDIRECT_URL#wechat_redirect`.replace('REDIRECT_URL', redirectUrl);
            }
            console.log(error);
        }
        return redirectUrl;
    }

    /**
     * @function 发送message消息
     */
    async appmessage() {

        const { ctx, app } = this;

        await this.init();

        // 缓存控制器
        const store = app.cache.store('redis');

        const query = ctx.query;
        const message = query.message || ctx.params.message;
        const userid = query.userid || ctx.params.userid;
        const agentid = query.agentid || ctx.params.agentid || wxConfig.enterpriseCD.agentid;
        const redirectUrl = this.queryRedirectURL(query.rurl || ctx.params.rurl);

        // 获取TokenURL
        const tokenAPI = `${wxConfig.wework.message.gettoken}?corpid=${wxConfig.enterpriseCD.id}&corpsecret=${wxConfig.enterpriseCD.agent[agentid]}`;
        // 获取动态token
        let token = await store.get(`wxConfig.wework.access_token@${agentid}`);
        // 消息中的链接消息
        let messageurl = '';

        console.log(token);

        // 检查token是否存在，如果不存在，则刷新token
        if (!token) {
            const result = await axios.get(tokenAPI);
            token = result.data.access_token;
            store.set(`wxConfig.wework.access_token@${agentid}`, token, 3600);
            console.log('get token from wechat rest api :' + token);
        } else {
            // 打印token值
            console.log('get token from redis :' + token);
        }

        console.log('redirect');

        // 如果存在回调URL，则编辑消息中的链接信息
        if (redirectUrl) {
            messageurl = `，链接: <a href="${redirectUrl}">详情</a>`;
        }

        const users = userid.split(',').map(item => { return `'${item}'`; }).join(',');

        // 根据userid(OA账户)获取对应企业微信ID
        const sql = `select id , loginid , lastname from ${config.database}.dbo.hrmresource where loginid in (${users});`;
        // 打印日志信息
        console.log(`appmessage generated sql : ${sql}`);
        // 获取查询后的用户ID
        const resdata = await this.pool.query(sql);

        // 查询MySQL, 排出由于OA与企业微信不匹配的异常
        const msql = `select account id , name , mobile , loginid from v_resource where loginid in (${users});`;
        // 获取查询返回结果
        const resinfo = await app.mysql.query(msql, null);

        console.log('message: ' + JSON.stringify(resinfo));

        // userID
        let userID = userid;
        let userlist = [];

        if (resdata && resdata.recordset && resdata.recordset.length > 0) {
            userlist = userlist.concat(resdata.recordset);
        }

        if (resinfo && resinfo.length > 0) {
            userlist = userlist.concat(resinfo);
        }

        if (userlist && userlist.length === 1) {
            userID = userlist[0].id;
        } else if (userlist && userlist.length > 1) {
            userID = userlist.map(obj => { return obj.id; }).join('|');
        }

        console.log(`userid : ${userID}`);

        // 发送信息URL
        const queryAPI = wxConfig.wework.message.api + token;

        const node = {
            touser: `${userID}`,
            msgtype: 'text',
            agentid,
            text: {
                content: redirectUrl ? `${message}${messageurl}` : message,
            },
            safe: 0,
            enable_id_trans: 0,
            enable_duplicate_check: 0,
            duplicate_check_interval: 1800,
        };

        console.log(JSON.stringify(node));

        console.log(`${queryAPI}:${message}:${userid}:${userID}:${redirectUrl}:${JSON.stringify(node)}`);

        const result = await axios.post(queryAPI, node);

        ctx.body = result.data;

        console.log(JSON.stringify(result.data));
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
        const tokenAPI = `${wxConfig.wework.message.gettoken}?corpid=${wxConfig.enterpriseCD.id}&corpsecret=${wxConfig.enterpriseCD.agent[agentid]}`;
        // 获取动态token
        let token = await store.get(`wxConfig.wework.access_token@${agentid}`);

        // 检查token是否存在，如果不存在，则刷新token
        if (!token) {
            const result = await axios.get(tokenAPI);
            token = result.data.access_token;
            store.set(`wxConfig.wework.access_token@${agentid}`, token, 3600);
            console.log('get token from wechat rest api :' + token);
        } else {
            // 打印token值
            console.log('get token from redis :' + token);
        }

        return token;
    }

    /**
     * @function 获取企业微信token
     */
    async queryTokenByRewardSystem() {

        const { app } = this;

        await this.init();

        // 缓存控制器
        const store = app.cache.store('redis');
        const agentid = wxConfig.enterpriseCD.reward.agentid;

        // 获取TokenURL
        const tokenAPI = `${wxConfig.wework.message.gettoken}?corpid=${wxConfig.enterpriseCD.id}&corpsecret=${wxConfig.enterpriseCD.reward.secret}`;
        // 获取动态token
        let token = await store.get(`wxConfig.wework.access_token@${agentid}`);

        // 检查token是否存在，如果不存在，则刷新token
        if (!token) {
            const result = await axios.get(tokenAPI);
            token = result.data.access_token;
            store.set(`wxConfig.wework.access_token@${agentid}`, token, 3600);
            console.log('get token from wechat rest api :' + token);
        } else {
            // 打印token值
            console.log('get token from redis :' + token);
        }

        return token;
    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID
     */
    async queryWeWorkUserInfo() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        const userid = ctx.query.userid || ctx.params.userid || '';

        // 获取动态token
        const userinfo = await ctx.service.bussinesscd.queryUserInfoByID(userid);

        if (userinfo) {
            try {
                ctx.body = JSON.parse(userinfo);
            } catch (error) {
                ctx.body = userinfo;
            }
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.user.queryAPI.replace('ACCESS_TOKEN', token).replace('USERID', userid);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 保存用户信息
            store.set(`wxConfig.wework.user.userinfo@${userid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID
     */
    async queryWeWorkUserInfoByMobile() {

        const { ctx } = this;

        const mobile = ctx.query.mobile || ctx.params.mobile || '';

        // 获取动态token
        const userinfo = await ctx.service.bussinesscd.queryUserInfoByMobile(mobile);

        try {
            ctx.body = JSON.parse(userinfo);
        } catch (error) {
            ctx.body = userinfo;
        }

    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD
     */
    async queryWeWorkDepartUser() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        const departid = ctx.query.departid || ctx.params.departid || '2';
        const fetch = ctx.query.fetch || ctx.params.fetch || '1';

        // 获取动态token
        const userlist = await store.get(`wxConfig.wework.user.queryDepartUserAPI_FETCH_CHILD#${fetch}@${departid}`);

        if (userlist) {
            ctx.body = JSON.parse(userlist);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.user.queryDepartUserAPI.replace('ACCESS_TOKEN', token).replace('DEPARTMENT_ID', departid).replace('FETCH_CHILD', fetch);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 保存用户信息
            store.set(`wxConfig.wework.user.queryDepartUserAPI_FETCH_CHILD#${fetch}@${departid}`, JSON.stringify(result.data), 3600 * 24 * 1);

            // 遍历数据，每个用户ID，存一个用户信息
            for (const item of result.data.userlist) {

                // 将数据存入缓存中
                await store.set(`wxConfig.wework.user.userinfo#mobile#@${item.mobile}`, JSON.stringify(item), wxConfig.timestamp.ONE_DAY);
                await store.set(`wxConfig.wework.user.userinfo@${item.userid}`, JSON.stringify(item), wxConfig.timestamp.ONE_DAY);

                item.id = tools.queryUniqueID();
                item.company = '创达';
                try {
                    item.department = item.department ? JSON.stringify(item.department) : '';
                    item.extattr = item.extattr ? JSON.stringify(item.extattr) : '';
                    item.is_leader_in_dept = item.is_leader_in_dept ? JSON.stringify(item.is_leader_in_dept) : '';
                    item.order = item.order ? JSON.stringify(item.order) : '';
                    item.external_position = item.external_position ? JSON.stringify(item.external_position) : '';
                } catch (error) {
                    console.error(error);
                }

                // 检查待存入的数据是否存在于数据库中，如果存在，则不存入(执行更新)，如果不存在，则插入数据
                const response = await app.mysql.query(` select count(0) count , id , company from bs_wework_user where userid = '${item.userid}' and company = '${item.company}' group by id `, []);
                console.log('数据是否存在查询结果: ' + JSON.stringify(response));

                if (response.length == 0 || response[0].count === 0) {
                    await this.postTableData('bs_wework_user', item);
                } else { // 执行更新操作，如果是晚上某点，则执行更新
                    delete item.id;
                    delete item.department;
                    delete item.extattr;
                    delete item.is_leader_in_dept;
                    delete item.order;
                    delete item.external_position;
                    delete item.external_profile;
                    delete item.external_corp_name;
                    await this.patchTableData('bs_wework_user', response[0].id, item);
                }

            }

            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD
     */
    async queryWeWorkDepartUserSim() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        const departid = ctx.query.departid || ctx.params.departid || '2';
        const fetch = ctx.query.fetch || ctx.params.fetch || '1';

        // 获取动态token
        const userlist = await store.get(`wxConfig.wework.user#queryWeWorkDepartUserSim#_FETCH_CHILD#${fetch}@${departid}`);

        if (userlist) {
            ctx.body = JSON.parse(userlist);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.user.queryDepartUserAPI.replace('ACCESS_TOKEN', token).replace('DEPARTMENT_ID', departid).replace('FETCH_CHILD', fetch);
            // 获取返回结果
            const result = await axios.get(queryURL);

            // 遍历数据，每个用户ID，存一个用户信息
            let list = result.data.userlist.map(item => {
                item = tools.pick(item, ['thumb_avatar', 'name', 'userid']);
                return (item = { avatar: item.thumb_avatar, name: item.name, id: item.userid });
            });

            list = list.sort((n1, n2) => {
                return n1.id.localeCompare(n2.id);
            });

            // 保存用户信息
            store.set(`wxConfig.wework.user#queryWeWorkDepartUserSim#_FETCH_CHILD#${fetch}@${departid}`, JSON.stringify(list), wxConfig.timestamp.ONE_DAY);

            // 设置返回信息
            ctx.body = list;
        }

    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD
     */
    async queryWeWorkSimpleDepartUser() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        const departid = ctx.query.departid || ctx.params.departid || '2';
        const fetch = ctx.query.fetch || ctx.params.fetch || '1';

        // 获取动态token
        const userlist = await store.get(`wxConfig.wework.user.querySimpleDepartUserAPI_FETCH_CHILD#${fetch}@${departid}`);

        if (userlist) {

            ctx.body = JSON.parse(userlist);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.user.querySimpleDepartUserAPI.replace('ACCESS_TOKEN', token).replace('DEPARTMENT_ID', departid).replace('FETCH_CHILD', fetch);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 保存用户信息
            store.set(`wxConfig.wework.user.querySimpleDepartUserAPI_FETCH_CHILD#${fetch}@${departid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
            // 遍历数据，每个用户ID，存一个用户信息
            result.data.userlist.map(item => {
                return store.set(`wxConfig.wework.user.userinfo.simple@${item.userid}`, JSON.stringify(item), wxConfig.timestamp.ONE_DAY);
            });
            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取用户信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN
     */
    async queryWeWorkDepartlist() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        let departid = ctx.query.departid || ctx.params.departid || '';
        let params = '';

        departid = departid === '-1' ? '' : departid;

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.department.queryALL@${departid}`);

        if (departid) {
            params = `&id=${departid}`;
        }

        console.log(` departid : ${departid} params : ${params}`);

        if (userinfo) {
            ctx.body = JSON.parse(userinfo);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.department.queryALL.replace('ACCESS_TOKEN', token) + params;
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 保存用户信息
            store.set(`wxConfig.wework.department.queryALL@${departid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
            // 遍历数据，每个用户ID，存一个用户信息
            for (const item of result.data.department) {
                await store.set(`wxConfig.wework.department.single@${item.id}`, JSON.stringify(item), wxConfig.timestamp.ONE_DAY);
                item.company = '创达';
                // 检查待存入的数据是否存在于数据库中，如果存在，则不存入(执行更新)，如果不存在，则插入数据
                const response = await app.mysql.query(` select count(0) id from bs_wework_depart where id = '${item.id}' and company = '${item.company}' `, []);
                console.log('数据是否存在查询结果: ' + JSON.stringify(response));
                if (response[0].id === 0) {
                    await this.postTableData('bs_wework_depart', item);
                } else { // 执行更新操作，如果是晚上某点，则执行更新
                    console.log(`id : ${item.id} , company: ${item.company} is already exist !`);
                }
            }
            // 打印字符串
            console.log('queryURL : ' + queryURL);
            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取部门信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN
     */
    async queryWeWorkDepartInfo() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        // 获取部门编号
        const departid = ctx.query.departid || ctx.params.departid || '1';

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.department.single@${departid}`);

        if (userinfo) {
            ctx.body = JSON.parse(userinfo);
        } else {
            // 设置返回信息
            await this.queryWeWorkDepartlist();
        }

    }

    /**
     * @function 获取部门信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN
     */
    async queryWeWorkUserByCode() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        // 获取部门编号
        const code = ctx.query.code || ctx.params.code || '';

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.user.code@${code}`);

        // 如果查询到缓存信息，则直接使用缓存信息，如果未查询到缓存信息，则查询用户信息
        if (userinfo) {

            let response = null;

            try {
                response = JSON.parse(userinfo);
            } catch (error) {
                response = userinfo;
            }

            if (response.errcode === 0) {

                try {
                    if (!response.userinfo.systemuserinfo && response.userinfo.mobile) {
                        // 获取用户信息
                        const user = await ctx.service.bussinesscd.queryEmployeeByMobile(response.userinfo.mobile);
                        response.userinfo.systemuserinfo = user;
                        response.userinfo.username = response.userinfo.systemuserinfo.username;
                        response.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(response.userinfo.systemuserinfo.username); // 用户管理组权限
                        // 保存用户信息
                        store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(response), wxConfig.timestamp.ONE_DAY);
                    }

                } catch (error) {
                    console.log(error);
                }

                try {
                    if (!response.userinfo.department && response.userinfo.main_department) {
                        // 查询部门信息
                        const department = await ctx.service.bussinesscd.queryDepartmentByID(response.userinfo.main_department);
                        response.userinfo.department = department;
                        console.log(JSON.stringify(department));
                        // 查询公司信息
                        const company = await ctx.service.bussinesscd.queryDepartmentByID(department.parentid);
                        response.userinfo.company = company;
                        console.log(JSON.stringify(company));
                        // 查询上级公司信息
                        const parent_company = await ctx.service.bussinesscd.queryDepartmentByID(company.parentid);
                        response.userinfo.parent_company = parent_company;
                        console.log(JSON.stringify(parent_company));
                        // 查询顶级公司信息
                        const top_company = await ctx.service.bussinesscd.queryDepartmentByID(parent_company.parentid);
                        response.userinfo.top_company = top_company;
                        console.log(JSON.stringify(top_company));
                        // 保存用户信息
                        store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(response), wxConfig.timestamp.ONE_DAY);
                    }
                } catch (error) {
                    console.log(error);
                }

                console.log(JSON.stringify(response));

            }

            ctx.body = response;

        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.user.queryCodeAPI.replace('ACCESS_TOKEN', token).replace('CODE', code);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 打印查询结果信息
            console.log('result : ' + JSON.stringify(result.data));
            // 如果存在用户UserID信息，则进一步查询用户信息
            try {
                if (result.data.UserId) {

                    // 查询OpenID
                    const openinfo = await this.queryOpenIDByUserID(result.data.UserId);

                    // 查询基础数据
                    try {
                        await this.queryWeWorkDepartInfo();
                        await this.queryWeWorkDepartlist();
                        await this.queryWeWorkSimpleDepartUser();
                        await this.queryWeWorkDepartUser();
                    } catch (error) {
                        console.log(error);
                    }

                    // 获取动态token
                    try {
                        result.data.userinfo = await ctx.service.bussinesscd.queryUserInfoByID(result.data.UserId);
                    } catch (error) {
                        console.log(error);
                    }

                    // 解析字符串为json对象
                    try {
                        if (result.data.userinfo) {
                            // result.data.userinfo = JSON.parse(result.data.userinfo);

                            try {
                                result.data.userinfo.orgin_userid = result.data.UserId;
                                result.data.userinfo.realname = result.data.userinfo.name;
                                result.data.userinfo.phone = result.data.userinfo.mobile;
                                result.data.userinfo.openid = openinfo.openid;
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (result.data.userinfo.userid) {
                                    // 获取用户信息
                                    const user = await ctx.service.bussinesscd.queryEmployeeByID(result.data.userinfo.userid, result.data.userinfo.name, result.data.userinfo.mobile);
                                    result.data.userinfo.systemuserinfo = user;
                                    result.data.userinfo.username = result.data.userinfo.systemuserinfo.username;
                                    result.data.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(result.data.userinfo.systemuserinfo.username); // 用户管理组权限
                                }
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (!result.data.userinfo.systemuserinfo && result.data.userinfo.mobile) {
                                    // 获取用户信息
                                    const user = await ctx.service.bussinesscd.queryEmployeeByMobile(result.data.userinfo.mobile);
                                    result.data.userinfo.systemuserinfo = user;
                                    result.data.userinfo.username = result.data.userinfo.systemuserinfo.username;
                                    result.data.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(result.data.userinfo.systemuserinfo.username); // 用户管理组权限
                                }
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (result.data.userinfo.main_department) {
                                    // 查询部门信息
                                    const department = await ctx.service.bussinesscd.queryDepartmentByID(result.data.userinfo.main_department);
                                    result.data.userinfo.department = department;
                                    console.log(JSON.stringify(department));
                                    // 查询公司信息
                                    const company = await ctx.service.bussinesscd.queryDepartmentByID(department.parentid);
                                    result.data.userinfo.company = company;
                                    console.log(JSON.stringify(company));
                                    // 查询上级公司信息
                                    const parent_company = await ctx.service.bussinesscd.queryDepartmentByID(company.parentid);
                                    result.data.userinfo.parent_company = parent_company;
                                    console.log(JSON.stringify(parent_company));
                                    // 查询顶级公司信息
                                    const top_company = await ctx.service.bussinesscd.queryDepartmentByID(parent_company.parentid);
                                    result.data.userinfo.top_company = top_company;
                                    console.log(JSON.stringify(top_company));
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    // 保存用户信息
                    store.set(`wxConfig.wework.user.code#openid#@${openinfo.openid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
                }

            } catch (error) {
                console.log(error);
            }

            // 保存用户信息
            store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);

            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取部门信息 queryWechatWorkUserInfo
     * @description https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN
     */
    async queryWeWorkUserByCodeRewardSystem() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');
        // 获取部门编号
        const code = ctx.query.code || ctx.params.code || '';

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.user.code@${code}`);

        // 如果查询到缓存信息，则直接使用缓存信息，如果未查询到缓存信息，则查询用户信息
        if (userinfo) {
            let response = null;

            try {
                response = JSON.parse(userinfo);
            } catch (error) {
                response = userinfo;
            }

            try {
                if (!response.userinfo.systemuserinfo && response.userinfo.mobile) {
                    // 获取用户信息
                    const user = await ctx.service.bussinesscd.queryEmployeeByMobile(response.userinfo.mobile);
                    response.userinfo.systemuserinfo = user;
                    response.userinfo.username = response.userinfo.systemuserinfo.username;
                    response.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(response.userinfo.systemuserinfo.username); // 用户管理组权限
                    // 保存用户信息
                    store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(response), wxConfig.timestamp.ONE_DAY);
                }

            } catch (error) {
                console.log(error);
            }

            try {
                if (!response.userinfo.department && response.userinfo.main_department) {
                    // 查询部门信息
                    const department = await ctx.service.bussinesscd.queryDepartmentByID(response.userinfo.main_department);
                    response.userinfo.department = department;
                    console.log(JSON.stringify(department));
                    // 查询公司信息
                    const company = await ctx.service.bussinesscd.queryDepartmentByID(department.parentid);
                    response.userinfo.company = company;
                    console.log(JSON.stringify(company));
                    // 查询上级公司信息
                    const parent_company = await ctx.service.bussinesscd.queryDepartmentByID(company.parentid);
                    response.userinfo.parent_company = parent_company;
                    console.log(JSON.stringify(parent_company));
                    // 查询顶级公司信息
                    const top_company = await ctx.service.bussinesscd.queryDepartmentByID(parent_company.parentid);
                    response.userinfo.top_company = top_company;
                    console.log(JSON.stringify(top_company));
                    // 保存用户信息
                    store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(response), wxConfig.timestamp.ONE_DAY);
                }
            } catch (error) {
                console.log(error);
            }

            console.log(JSON.stringify(response));

            ctx.body = response;
        } else {
            // 获取token
            const token = await this.queryTokenByRewardSystem();
            // 获取URL
            const queryURL = wxConfig.wework.user.queryCodeAPI.replace('ACCESS_TOKEN', token).replace('CODE', code);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 打印查询结果信息
            console.log('result : ' + JSON.stringify(result.data));
            // 如果存在用户UserID信息，则进一步查询用户信息
            try {
                if (result.data.UserId) {

                    // 查询OpenID
                    const openinfo = await this.queryOpenIDByUserID(result.data.UserId);

                    console.log('openinfo : ' + JSON.stringify(openinfo));

                    // 查询基础数据
                    try {
                        await this.queryWeWorkDepartInfo();
                        await this.queryWeWorkDepartlist();
                        await this.queryWeWorkSimpleDepartUser();
                        await this.queryWeWorkDepartUser();
                    } catch (error) {
                        console.log(error);
                    }

                    // 获取动态token
                    try {
                        result.data.userinfo = await ctx.service.bussinesscd.queryUserInfoByID(result.data.UserId);
                    } catch (error) {
                        console.log(error);
                    }

                    // 解析字符串为json对象
                    try {
                        if (result.data.userinfo) {

                            try {
                                result.data.userinfo.orgin_userid = result.data.UserId;
                                result.data.userinfo.realname = result.data.userinfo.name;
                                result.data.userinfo.phone = result.data.userinfo.mobile;
                                result.data.userinfo.openid = openinfo.openid;
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (result.data.userinfo.userid) {
                                    // 获取用户信息
                                    const user = await ctx.service.bussinesscd.queryEmployeeByID(result.data.userinfo.userid, result.data.userinfo.name, result.data.userinfo.mobile);
                                    result.data.userinfo.systemuserinfo = user;
                                    result.data.userinfo.username = result.data.userinfo.systemuserinfo.username;
                                    result.data.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(result.data.userinfo.systemuserinfo.username); // 用户管理组权限
                                }
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (!result.data.userinfo.systemuserinfo && result.data.userinfo.mobile) {
                                    // 获取用户信息
                                    const user = await ctx.service.bussinesscd.queryEmployeeByMobile(result.data.userinfo.mobile);
                                    result.data.userinfo.systemuserinfo = user;
                                    result.data.userinfo.username = result.data.userinfo.systemuserinfo.username;
                                    result.data.userinfo.grouplimits = await ctx.service.bussinesscd.queryGroupLimitsByID(result.data.userinfo.systemuserinfo.username); // 用户管理组权限
                                }
                            } catch (error) {
                                console.log(error);
                            }

                            try {
                                if (result.data.userinfo.main_department) {
                                    // 查询部门信息
                                    const department = await ctx.service.bussinesscd.queryDepartmentByID(result.data.userinfo.main_department);
                                    result.data.userinfo.department = department;
                                    console.log(JSON.stringify(department));
                                    // 查询公司信息
                                    const company = await ctx.service.bussinesscd.queryDepartmentByID(department.parentid);
                                    result.data.userinfo.company = company;
                                    console.log(JSON.stringify(company));
                                    // 查询上级公司信息
                                    const parent_company = await ctx.service.bussinesscd.queryDepartmentByID(company.parentid);
                                    result.data.userinfo.parent_company = parent_company;
                                    console.log(JSON.stringify(parent_company));
                                    // 查询顶级公司信息
                                    const top_company = await ctx.service.bussinesscd.queryDepartmentByID(parent_company.parentid);
                                    result.data.userinfo.top_company = top_company;
                                    console.log(JSON.stringify(top_company));
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    // 保存用户信息
                    store.set(`wxConfig.wework.user.code#openid#@${openinfo.openid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
                }

            } catch (error) {
                console.log(error);
            }

            // 保存用户信息
            store.set(`wxConfig.wework.user.code@${code}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);

            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取企业微信服务器IP列表信息 queryIpList
     * @description https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=ACCESS_TOKEN
     */
    async queryIpList() {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取动态token
        const userinfo = await store.get('wxConfig.wework.ip.queryIpListAPI');

        if (userinfo) {
            ctx.body = JSON.parse(userinfo);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.ip.queryIpListAPI.replace('ACCESS_TOKEN', token);
            // 获取返回结果
            const result = await axios.get(queryURL);
            // 保存用户信息
            store.set('wxConfig.wework.ip.queryIpListAPI', JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
            // 设置返回信息
            ctx.body = result.data;
        }

    }

    /**
     * @function 获取企业微信服务器IP列表信息 queryIpList
     * @description https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=ACCESS_TOKEN
     * @param {*} id
     */
    async queryOpenIDByUserID(id) {

        const { ctx, app } = this;

        // 缓存控制器
        const store = app.cache.store('redis');

        // 获取部门编号
        const userid = ctx.query.userid || ctx.params.userid || id || '';

        // 获取动态token
        const userinfo = await store.get(`wxConfig.wework.openid#userid#@${userid}`);

        if (userinfo) {
            ctx.body = JSON.parse(userinfo);
        } else {
            // 获取token
            const token = await this.queryToken();
            // 获取URL
            const queryURL = wxConfig.wework.openid.queryOpenIDByUserIdAPI.replace('ACCESS_TOKEN', token);
            // 获取返回结果
            const result = await axios.post(queryURL, { userid });

            console.log(`queryURL: ${queryURL} \n\r result: ` + JSON.stringify(result.data));
            // 保存用户信息
            store.set(`wxConfig.wework.openid#userid#@${userid}`, JSON.stringify(result.data), wxConfig.timestamp.ONE_DAY);
            // 设置返回信息
            ctx.body = result.data;
        }

        return ctx.body;
    }

    /**
     * @function 提交并持久化数据到服务器
     * @param {*} tableName
     * @param {*} node
     */
    async postTableData(tableName, node) {

        tableName = tableName.toLowerCase();
        const insertURL = `${wxConfig.wework.api_url}/${tableName}`;
        const value = node;

        // 设置时间格式
        Object.keys(value).map(key => {
            value[key] = (key.includes('time') || key.includes('created') || key.includes('modified')) && value[key] ? dayjs(value[key]).format('YYYY-MM-DD HH:mm:ss') : value[key];
        });

        try {
            const res = await superagent.post(insertURL).send(node).set('accept', 'json');
            console.log(JSON.stringify(res.boyd));
            return res.body;
        } catch (err) {
            console.log(err);
        }

    }

    /**
     * 更新数据
     * @param {*} tableName
     * @param {*} id
     * @param {*} node
     */
    async patchTableData(tableName, id, node) {

        tableName = tableName.toLowerCase();
        const patchURL = `${wxConfig.wework.api_url}/${tableName}/${id}`;
        let res = null;

        //如果传入数据为空，则直接返回错误
        if (typeof node == 'undefined' || node == null || node == '') {
            return false;
        }

        try {
            res = await superagent.patch(patchURL).send(node).set('accept', 'json');
        } catch (err) {
            console.log(err);
        }

        return res.body;
    }


}

module.exports = WeworkCDController;