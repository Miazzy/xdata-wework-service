/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;

const tools = require('../utils/tools');

class MailController extends Controller {

    async send() {
        const { ctx, app } = this;

        const version = ctx.query.version || ctx.params.version || 'v1'; // 获取version
        const query = ctx.query;
        const title = query.title || ctx.params.title;
        const description = query.description || ctx.params.description;
        const receiver = query.receiver || ctx.params.receiver;
        const rurl = query.rurl || ctx.params.rurl || query.url || ctx.params.url || '';
        const link = rurl ? `<div>链接：${rurl}</div>` : '';

        console.log(title + ':' + description + ':' + receiver + ':' + rurl);

        // sync
        const res = await app.mailer.send({
            to: receiver, // list of receivers
            subject: title, // Subject line
            text: description, // plain text body
            html: `<b>${description}</b>${link}`, // html body
        });

        console.log(res.response);

        ctx.body = res;
    }

    async postData() {

        const { ctx, app } = this;
        const query = ctx.query;

        const version = ctx.query.version || ctx.params.version || 'v1'; // 获取version
        let companyInfo = query.company || ctx.params.company;
        let stocks = query.stocks || ctx.params.stocks;
        let qualification = query.qualification || ctx.params.qualification;

        if (companyInfo && typeof companyInfo == 'string') {
            companyInfo = JSON.parse(companyInfo);
            console.log(`company info :`, companyInfo);
        }

        if (stocks && typeof stocks == 'string') {
            stocks = JSON.parse(stocks);
            console.log(`company stocks info :`, stocks);
        }

        if (qualification && typeof qualification == 'string') {
            qualification = JSON.parse(qualification);
            console.log(`company qualification info :`, qualification);
        }

        const res = await tools.postMainDataInfoInc(companyInfo, stocks, qualification);

        ctx.body = res;
    }
}


module.exports = MailController;