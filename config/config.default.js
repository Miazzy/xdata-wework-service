/* eslint valid-jsdoc: "off" */
/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const redisStore = require('cache-manager-ioredis');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {

    const config = exports = {};
    config.keys = appInfo.name + '_0000_5432';
    config.middleware = [];
    const userConfig = {
        myAppName: 'xdata-wework-service',
    };

    const nacosIP = 'nacos.yunwisdom.club'; //nacos IP地址
    const nacosList = [`${nacosIP}:30080`];

    const redisIP = 'r-bp16338c31627a24pd.redis.rds.aliyuncs.com';
    const redisPassword = 'Redis@password';
    const redisPort = 6379;

    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true,
        },
        domainWhiteList: ['*'],
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };



    config.mailer = {
        host: 'smtp.exmail.qq.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'zhaoziyu@yunwisdom.club', // generated ethereal user
            pass: 'Miazzy@163.com', // generated ethereal password
        },
    };

    config.oss = {
        client: {
            accessKeyId: 'your access key',
            accessKeySecret: 'your access secret',
            bucket: 'your bucket name',
            endpoint: 'oss-cn-hongkong.aliyuncs.com',
            timeout: '60s',
        },
    };

    // 缓存配置
    config.cache = {
        default: 'memory',
        stores: {
            memory: {
                driver: 'memory',
                max: 100,
                ttl: 0,
            },
            redis: {
                driver: redisStore,
                host: redisIP,
                password: redisPassword,
                port: redisPort,
                db: 0,
                ttl: 600,
                valid: _ => _ !== null,
            },
        },
    };

    // oracle数据库连接配置
    config.oracle = {
        client: {
            user: 'user',
            password: 'password',
            connectString: 'localhost/orcl',
        },
    };

    /** 类似sentinel的限流工具qps限流 */
    config.ratelimiter = {
        router: [{
                path: '/apis/**', //请注意匹配优先级，放在前面优先级越高，越先匹配
                max: 100000,
                time: '5s', //时间单位 s m h d y ...
                message: 'Custom request overrun error message path:/apis ' //自定义请求超限错误信息
            },
            {
                path: '/api/**',
                max: 100000,
                time: '5s', //时间单位 s m h d y ...
                message: 'Custom request overrun error message path:/api ' //自定义请求超限错误信息
            }
        ]
    }

    // mysql数据库连接配置
    config.mysql = {
        client: { // database configuration
            host: '172.18.254.95',
            port: '39090',
            user: 'zhaoziyun',
            password: 'ziyequma',
            database: 'xdata',
        },
        procedure: false,
        app: true,
        agent: false,
    };

    // mssql数据库连接配置
    config.mssql = { // Multi Databases
        clients: {
            db1: {
                server: '172.18.1.11',
                port: '1433',
                user: 'meeting',
                password: 'meeting',
                database: 'newecology',
            },
            db2: {
                server: '172.18.1.60',
                port: '1433',
                user: 'sa',
                password: 'Leading888',
                database: 'ecology',
            },
        },
    };

    config.dbconfig = {
        user: config.mssql.clients.db1.user,
        password: config.mssql.clients.db1.password,
        server: config.mssql.clients.db1.server,
        database: config.mssql.clients.db1.database,
        port: config.mssql.clients.db1.port,
        options: {
            encrypt: false,
            enableArithAbort: false,
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000,
        },
    };

    // 网关代理配置
    config.httpProxy = {
        '@nacos': {
            logger: console,
            serverList: nacosList, // replace to real nacos serverList
            namespace: 'public',
        },
        '/apis': {
            target: ['http://172.18.254.95:3000', 'http://172.18.254.96:3000'],
            serviceName: 'xdata-xmysql-service',
            pathRewrite: { '^/apis': '/api_' },
        },
    };

    config.multipart = { // 设置支持的上传文件类型
        whitelist: ['.apk', '.pptx', '.docx', '.xlsx', '.csv', '.doc', '.ppt', '.xls', '.pdf', '.pages', '.wav', '.mov', '.txt', '.png', '.jpeg', '.jpg', '.gif', '.tar.gz', '.tar', '.zip', '.mp3', '.mp4', '.avi'],
        fileSize: '1024mb', // 设置最大可以上传文件大小
    };

    config.redis = {
        client: {
            host: redisIP,
            password: redisPassword,
            port: redisPort,
            db: 0,
        },
    };

    config.nacos = {
        register: true,
        logger: console,
        serverList: nacosList, // replace to real nacos serverList
        namespace: 'public',
        serviceName: 'xdata-wework-service',
    };

    config.elasticsearch = {
        host: 'elasticsearch.yunwisdom.club:30080',
        apiVersion: '7.x'
    };

    config.elasticsearchsync = {
        register: false,
        logger: console,
        serverList: nacosList, // replace to real nacos serverList
        namespace: 'public',
        serviceName: 'xdata-essync-service',
        es: {
            host: 'elasticsearch.yunwisdom.club:30080',
            port: 30080,
            apiVersion: '7.x',
        },
        mysql: {
            host: config.mysql.client.host,
            port: config.mysql.client.port,
            user: config.mysql.client.user,
            password: config.mysql.client.password,
            database: config.mysql.client.database,
        },
        job1: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_seal_regist',
            params: 'serialid',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job2: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_admin_group',
            params: 'serialid',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job3: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_admin_address',
            params: 'id',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        },
        job4: {
            database: 'xdata',
            index: 'xdata',
            type: 'bs_company_flow_base',
            params: 'id',
            sql: 'select * from ${index}.${type} where ${params} > :pindex order by ${params} asc limit 200',
            dbtable: 'bs_sync_rec', //持久化记录表 
            pindex: 0,
        }
    }

    config.eggEtcd = {
        hosts: [
            '172.18.1.51:32777',
            '172.18.1.51:32776',
            '172.18.1.51:32779',
        ],
        auth: { //curl -L http://localhost:32777/v3/auth/user/add  -X POST -d '{"name": "root", "password": "ziyequma"}'
            username: 'root',
            password: 'ziyequma',
        },
    };

    config.sentinelLimit = {
        status: true,
    }

    return {
        ...config,
        ...userConfig,
    };
};