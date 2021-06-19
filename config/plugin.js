/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

module.exports = {

    cors: {
        enable: true,
        package: 'egg-cors',
    },

    mailer: {
        enable: true,
        package: 'egg-mailer',
    },

    oss: {
        enable: false,
        package: 'egg-oss',
    },

    cache: {
        enable: true,
        package: 'egg-cache',
    },

    mysql: {
        enable: true,
        package: 'egg-mysql',
    },

    oracle: {
        enable: false,
        package: 'egg-oracle',
    },

    mssql: {
        enable: true,
        package: 'egg-mssql',
    },

    redis: {
        enable: true,
        package: 'egg-redis',
    },

    nacos: {
        enable: true,
        package: 'egg-nacos',
    },

    ratelimiter: {
        enable: true,
        package: 'egg-rate-limiters',
    },

    elasticsearch: {
        enable: true,
        package: 'egg-es',
    },

    eggEtcd: {
        enable: false,
        package: 'egg-etcd',
    },

};