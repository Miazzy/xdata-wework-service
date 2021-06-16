/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const dayjs = require('dayjs');
const superagent = require('superagent');
const axios = require('axios');

/**
 * @function 获取对象中属性
 * @param {*} obj 
 * @param {*} arr 
 */
exports.pick = (obj, arr) => {
    return arr.reduce((iter, val) => (val in obj && (iter[val] = obj[val]), iter), {});
};

/**
 * @function 合成唯一编码
 * @param {*} length
 */
exports.queryUniqueID = (length = 32) => {
    let id = dayjs().format('YYYYMMDDhhmmssSSS'); // 定义动态编码
    const random = (Math.floor(Math.random() * 100000000000000000000) + '') + (Math.floor(Math.random() * 100000000000000000000) + ''); // 定义随机编码
    console.log('随机编号 :' + random); // 打印随机编码
    id = (id + random).replace(/\./g, '').substring(0, length); // 合成动态编码
    return id; // 返回唯一编码
};

/**
 * 向主数据接口推送公司工商信息数据
 * @param {*} companyInfo 
 * @param {*} stocks 
 * @param {*} qualification 
 */
exports.postMainDataInfoInc = async(companyInfo, stocks = [{ "shareholder": "刘浩威", "ratioDetail": "0.30" }], qualification = [{ "qualificationType": "", "qualificationLevel": "", "qualificationNmber": "", "validityPeriod1": dayjs().format('YYYY-MM-DD HH:mm:ss'), "validityPeriod2": dayjs().format('YYYY-MM-DD HH:mm:ss'), "qualificationStatus": "有效", "cancellationReason": "" }, ], postURL = `http://mdm.leading-group.com:30012/api/inner/datahub/producer/serverApi`, resp = '') => {

    const stocklist = stocks;
    const qualificationlist = qualification;

    //待发送节点数据
    const node = {
        "appCode": "de",
        "topicCode": "cor_c",
        "jsonData": [{
            "single": [{
                "sn": companyInfo.id,
                "companyAreaCode": companyInfo.companyAreaCode,
                "companyArea": companyInfo.companyArea,
                "comPanyName": companyInfo.companyName,
                "comPanyNum": companyInfo.id,
                "registrationStatus": companyInfo.registrationStatus,
                "businessScope": companyInfo.businessScope,
                "registeredAddress": companyInfo.registeredAddress,
                "registeredCapital": companyInfo.registeredCapital,
                "legalRepresentative": companyInfo.legalRepresentative,
                "directorChairman": companyInfo.directorChairman,
                "director": companyInfo.director,
                "directorExecutive": "",
                "manager": companyInfo.manager,
                "supervisorChairman": companyInfo.supervisorChairman,
                "supervisor": companyInfo.supervisor,
                "validStatus": "0",
                "dataStatus": "0",
            }],
            "ShareholderInformation": [],
            "qualification": [],
        }]
    };

    console.log(`post url : `, postURL);
    console.log(`post mdm data node info :`, JSON.parse(JSON.stringify(node)));

    try {
        resp = await axios.post(postURL, JSON.stringify(node)); //resp = await superagent.post(postURL).send(JSON.stringify(node)).set('accept', '*/*').set('Content-Type', 'application/json');
    } catch (error) {
        resp = await superagent.post(postURL).send(JSON.parse(JSON.stringify(node))).set('accept', '*/*').set('Content-Type', 'application/json');
        console.log(`mdm data error:`, error);
    }

    //返回响应结果
    return resp;
};