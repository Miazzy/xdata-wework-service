/* eslint-disable indent */
/* eslint-disable eol-last */
'use strict';

/**
 * @function init
 * @description Set up btoa/atob function with NodeJS
 */
const init = () => {

    global.Buffer = global.Buffer || require('buffer').Buffer;

    if (typeof btoa === 'undefined') {
        global.btoa = function(str) {
            return new Buffer(str, 'binary').toString('base64');
        };
    }

    if (typeof atob === 'undefined') {
        global.atob = function(b64Encoded) {
            return new Buffer(b64Encoded, 'base64').toString('binary');
        };
    }

    console.log(' global install btoa and atob function ... ');

};

const base64 = {
    init,
};

module.exports = {
    ...base64,
};