/* eslint-disable spaced-comment */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const config = {
    company: {
        融量: { /**融量*/
            id: 'wx3b01d8bf4c588933',
            agentid: 1000077,
            admin: 1000077,
            reward: 1000079,
            stock: 1000084,
            legal: 1000104,
            1000077: 'tEyLB2-JfFLDu5enDRlMDWss4DvfAeKuzztZTWYvluc',
            1000079: 'LIFpDJwSpcQfqRJ5RXe8HANfj4Tx-9b7gdII6qCGVGg',
            1000084: 'mLxbjeYf_J1FGx0NBPaUCi6QLlNGZYiVMeW_sjocdro',
            1000104: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g',
        },
        创达: { /**创达*/
            id: 'ww3806b33a15a7d3fc',
            agentid: 1000013,
            admin: 1000013,
            reward: 1000015,
            stock: 1000020,
            legal: 1000104, // /** 创达的可能需要替换 */
            1000013: 'L1zd6Cn5leUOfmWWSiq0rn6lnWtddzdbo3XgV-6SxEA',
            1000015: 'jVlphxrx3rPnnsT9y3gl8iTU3kIkoNbiNraJ_Culv9I',
            1000020: 'pWFPtQtuO-JoFrgSiVoG8nb4DE-rJN1urTQHIVDcxGQ',
            1000104: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g',
        },
    },
    enterprise: {
        id: 'wx3b01d8bf4c588933',
        agentid: 1000077,
        secret: {
            contact: {
                code: 'mGEK17_5izesuLkQCgcyNadqBLK3aeU71Kp39-hWTdM',
            },
            workflowTodoItem: {
                agentid: 1000077,
                code: 'tEyLB2-JfFLDu5enDRlMDWss4DvfAeKuzztZTWYvluc',
            },
        },
        agent: {
            1000077: 'tEyLB2-JfFLDu5enDRlMDWss4DvfAeKuzztZTWYvluc',
            1000079: 'LIFpDJwSpcQfqRJ5RXe8HANfj4Tx-9b7gdII6qCGVGg',
            1000084: 'mLxbjeYf_J1FGx0NBPaUCi6QLlNGZYiVMeW_sjocdro',
            1000104: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g',
        },
        admin: {
            agentid: 1000077,
            secret: 'tEyLB2-JfFLDu5enDRlMDWss4DvfAeKuzztZTWYvluc',
        },
        reward: {
            agentid: 1000079,
            secret: 'LIFpDJwSpcQfqRJ5RXe8HANfj4Tx-9b7gdII6qCGVGg',
        },
        stock: {
            agentid: 1000084,
            secret: 'mLxbjeYf_J1FGx0NBPaUCi6QLlNGZYiVMeW_sjocdro',
        },
        legal: {
            agentid: 1000104,
            secret: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g',
        },
        message: {
            gettoken: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            api: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=',
        },
        ip: {
            queryIpListAPI: 'https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=ACCESS_TOKEN ',
        },
        user: {
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID',
            queryCodeAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE',
            queryDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
            querySimpleDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
        },
        openid: {
            queryOpenIDByUserIdAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN',
        },
        department: {
            queryALL: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN',
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=ID',
        },
        access_token: null,
    },
    enterpriseCD: {
        id: 'ww3806b33a15a7d3fc',
        agentid: 1000013,
        secret: {
            contact: {
                code: 'XAXnndDttZ5Lm859TSAarV9U86Heyr-M0wfXCyOSsgc',
            },
            workflowTodoItem: {
                agentid: 1000013,
                code: 'L1zd6Cn5leUOfmWWSiq0rn6lnWtddzdbo3XgV-6SxEA',
            },
        },
        agent: {
            1000013: 'L1zd6Cn5leUOfmWWSiq0rn6lnWtddzdbo3XgV-6SxEA',
            1000015: 'jVlphxrx3rPnnsT9y3gl8iTU3kIkoNbiNraJ_Culv9I',
            1000020: 'pWFPtQtuO-JoFrgSiVoG8nb4DE-rJN1urTQHIVDcxGQ',
            1000104: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g', // /** 创达的可能需要替换 */
        },
        admin: {
            agentid: 1000013,
            secret: 'L1zd6Cn5leUOfmWWSiq0rn6lnWtddzdbo3XgV-6SxEA',
        },
        reward: {
            agentid: 1000015,
            secret: 'jVlphxrx3rPnnsT9y3gl8iTU3kIkoNbiNraJ_Culv9I',
        },
        stock: {
            agentid: 1000020,
            secret: 'pWFPtQtuO-JoFrgSiVoG8nb4DE-rJN1urTQHIVDcxGQ',
        },
        legal: { /** 创达的可能需要替换 */
            agentid: 1000104,
            secret: 'Mp5ITrIHiIpQKLdLJxAZpsEECvZ2j9eyQqfJ4oUOq9g',
        },
        message: {
            gettoken: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            api: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=',
        },
        ip: {
            queryIpListAPI: 'https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=ACCESS_TOKEN ',
        },
        user: {
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID',
            queryCodeAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE',
            queryDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
            querySimpleDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
        },
        openid: {
            queryOpenIDByUserIdAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN',
        },
        department: {
            queryALL: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN',
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=ID',
        },
        access_token: null,
    },
    wework: {
        message: {
            gettoken: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            api: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=',
        },
        ip: {
            queryIpListAPI: 'https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip?access_token=ACCESS_TOKEN ',
        },
        user: {
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID',
            queryCodeAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=ACCESS_TOKEN&code=CODE',
            queryDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
            querySimpleDepartUserAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=ACCESS_TOKEN&department_id=DEPARTMENT_ID&fetch_child=FETCH_CHILD',
        },
        openid: {
            queryOpenIDByUserIdAPI: 'https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN',
        },
        department: {
            queryALL: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN',
            queryAPI: 'https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=ACCESS_TOKEN&id=ID',
        },
        access_token: null,
        api_url: 'https://api.yunwisdom.club:30443/gateway-xmysql/api',
    },
    seal: {
        users: {
            management: [{ id: 'yanggc', name: '杨高春', phone: '13880556967', }], //印章管理人员列表
            reception: [], //前台接待人员列表
            archive: [], //档案归档管理人员列表
        },
    },
    timestamp: {
        ONE_SECOND: 1,
        ONE_MINITE: 60,
        ONE_HOUR: 3600,
        ONE_DAY: 3600 * 24 * 1,
        ONE_WEEK: 3600 * 24 * 7,
        ONE_MONTH: 3600 * 24 * 31,
        ONE_YEAR: 3600 * 24 * 365,
    },
};

module.exports = {
    ...config,
};