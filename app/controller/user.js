/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

/**
 * @abstract 定义前端业务处理相关Controller
 */
class UserController extends Controller {

    /**
     * @function 获取用户管理组信息
     */
    async queryUserInfoByUserMobileCertNO() {

        const { ctx } = this;

        // 获取用户账号
        const username = ctx.query.username || ctx.params.username || '';
        // 获取用户phone
        const mobile = ctx.query.mobile || ctx.params.mobile || '';
        // 获取用户certno
        const certno = ctx.query.certno || ctx.params.certno || '';

        const result = await ctx.service.bussiness.queryUserInfoByUserMobileCertNO(username, mobile, certno);

        if (result && result.length > 0) {
            ctx.body = { success: true, result: true };
        } else {
            ctx.body = { success: false, result: false };
        }

    }

}

module.exports = UserController;