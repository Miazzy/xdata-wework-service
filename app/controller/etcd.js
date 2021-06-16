/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const Controller = require('egg').Controller;
class EtcdController extends Controller {

    /**
     * @function 数据库添加数据
     */
    async index() {

        const { ctx, app } = this;

        // 获取部门编号
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取部门编号
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取部门编号
        const id = ctx.query.id || ctx.params.id || 0;
        // 获取部门编号
        const content = ctx.query.data || ctx.params.data || ctx.query.content || ctx.params.content || '{}';

        try {
            console.log(content);
            ctx.body = await app.elasticsearch.index({
                index: schema,
                type,
                id,
                body: { content: content },
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @function 数据库添加数据
     */
    async search() {

        const { ctx, app } = this;

        // 获取部门编号
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取部门编号
        const type = ctx.query.type || ctx.params.type || 'type';

        // 获取部门编号
        const content = ctx.query.data || ctx.params.data || ctx.query.content || ctx.params.content || '{}';

        try {
            //const data = JSON.parse(content);
            console.log(content);
            ctx.body = await app.elasticsearch.search({
                index: schema,
                type,
                body: {
                    query: {
                        match: { content: content }
                    }
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @function 数据库添加数据
     */
    async delete() {

        const { ctx, app } = this;

        // 获取部门编号
        const schema = ctx.query.schema || ctx.params.schema || 'workspace';
        // 获取部门编号
        const type = ctx.query.type || ctx.params.type || 'type';
        // 获取部门编号
        const id = ctx.query.id || ctx.params.id || 0;

        try {
            ctx.body = await app.elasticsearch.delete({
                index: schema,
                type,
                id,
            });
        } catch (error) {
            ctx.body = { err: 'not find', code: 0 };
            console.log(error);
        }
    }
}

module.exports = EtcdController;