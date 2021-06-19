/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

/**
 * @abstract 定义前端业务处理相关Controller
 */
class BussinessController extends Controller {

    /**
     * @function 获取用户管理组信息
     */
    async queryGroupLimits() {
        const username = this.ctx.query.username || this.ctx.params.username || ''; // 获取用户信息
        this.ctx.body = await this.ctx.service.bussiness.queryGroupLimits(username); // 设置返回结果
    }

    /**
     * @function 获取用户管理组信息
     */
    async queryGroupLimitsByID() {
        const username = this.ctx.query.username || this.ctx.params.username || ''; // 获取用户信息
        this.ctx.body = await this.ctx.service.bussiness.queryGroupLimitsByID(username); // 设置返回结果
    }

}

module.exports = BussinessController;