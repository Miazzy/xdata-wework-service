/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

const config = {
    path: '/data/filesystem',
    imageurl: '/message-background.jpg',
    manage: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2da6821a-36d3-495b-8092-7220066a0cd8',
    front: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=181fbd10-47c5-4c61-ba2d-3c4762d5a64f',
    done: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07b69342-4b35-4b2e-ad69-249e23c57c21',
};

module.exports = {
    ...config,
};