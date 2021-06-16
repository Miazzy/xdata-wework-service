/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

const tools = require('../utils/tools');

class MainDataController extends Controller {

    async postData() {

        const { ctx, app } = this;
        const query = ctx.query;

        const companyInfo = query.company || ctx.params.company;
        const stocks = query.stocks || ctx.params.stocks;
        const qualification = query.qualification || ctx.params.qualification;

        const res = await tools.postMainDataInfoInc(companyInfo, stocks, qualification);

        ctx.body = res;
    }
}

module.exports = MainDataController;