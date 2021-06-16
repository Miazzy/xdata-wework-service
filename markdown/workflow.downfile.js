/* eslint-disable newline-per-chained-call */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-var */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable spaced-comment */
/* eslint-disable strict */
//检查本网站端口
const port = window.location.port ? window.location.port : window.location.protocol === 'https:' ? 443 : 80;
//获取主机域名或IP
const hostnameValue = window.location.host.split(':')[0];

//API调用接口
var apiURL = window.location.protocol + `//` + hostnameValue + `:` + port + `/jeecg-boot/api/v1`;
//下载调用通用接口
var downApiURL = window.location.protocol + `//` + hostnameValue + `:` + port + `/jeecg-boot/api/v1/filebase/`;
//文件下载调用接口
var fileApiURL = window.location.protocol + `//` + hostnameValue + `:` + port + `/jeecg-boot/api/v1/file/query/`;

//允许拦截视图标题 //允许拦截标题 const titleArray = ['通用审批单', '内部留言', '会议室申请单', '共享服务', '集团总裁工作部署通知'];
const viewArray = ['【融量】通用审批', 'RC01.通用审批', 'RC02.内部留言', 'RC03.会议室申请', 'RC04.共享服务', 'RC05.集团总裁工作部署通知', 'RC06.行政处罚单批量发送', 'RC07.会议通知/纪要', 'RC08.工作联系函', 'RC09.工作说明/汇报(单职能)'];
//是否开启检查标题 false: 开启 ， true: 所有标题都放行
const checkTitleFlag = true;
//标题验证标识
const checkTitleChar = "加密";
//检查企业微信UA
const userAgent = navigator.userAgent.toLowerCase();
//检查是否是Windows环境
const isWindows = userAgent.includes('windows');
//待下载文件信息
const fileArray = [];
//IP RegExp
const ipRegExp = /^(127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/;
//流程标题
var viewTitle = null;
//流程子标题
var requestName = null;

try {
    //流程标题
    viewTitle = ($('#view_page #view_title') && $('#view_page #view_title').html()) ? $('#view_page #view_title').html().trim() : '';
    //流程子标题
    requestName = ($('#requestnamespan') && $('#requestnamespan').html() && $('#requestnamespan').html().trim()) ? $('#requestnamespan').html().trim().slice(-4) : '';
} catch (error) {
    console.log(error);
}

//如果是IP,则换成域名
if (isValidIP(hostnameValue) && isOuterIP(hostnameValue)) {
    apiURL = "http://qy.leading-group.com:8082/jeecg-boot/api/v1";
    downApiURL = "http://qy.leading-group.com:8082/jeecg-boot/api/v1/filebase/";
    fileApiURL = "http://qy.leading-group.com:8082/jeecg-boot/api/v1/file/query/";
}

//如果是IP,则换成域名
if (isValidIP(hostnameValue) && isInnerIP(hostnameValue)) {
    apiURL = "http://wework.yunwisdom.club:8083/jeecg-boot/api/v1";
    downApiURL = "http://wework.yunwisdom.club:8083/jeecg-boot/api/v1/filebase/";
    fileApiURL = "http://wework.yunwisdom.club:8083/jeecg-boot/api/v1/file/query/";
}

/**
 * @function 定时任务数组执行器
 * @param {*} callback
 * @param  {...any} timestamps
 */
function setTimeouts(callback, ...timestamps) {
    timestamps.map(timestamp => {
        return setTimeout(function() {
            callback();
        }, timestamp);
    });
}

/**
 * @function 验证IP函数
 * @param {*} ip
 */
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

/**
 * @function 验证内网IP函数
 * @param {*} ip
 */
function isInnerIP(ip) {
    return ipRegExp.test(ip);
}

/**
 * @function 验证外网IP函数
 * @param {*} ip
 */
function isOuterIP(ip) {
    return !ipRegExp.test(ip);
}

/**
 * @function 检查文档是否需要进行代理下载函数
 */
function isTransDownFile() {

    return (viewArray.includes(viewTitle) || checkTitleFlag) && (isNull(requestName) || requestName.includes(checkTitleChar));

}

/**
 * @function 检查文档是否需要进行代理下载函数(标题含有加密即需要代理)
 */
function isProxyDownFile() {
    let viewTitle = null; //流程标题
    let requestName = null; //流程子标题
    try {
        viewTitle = ($('#view_page #view_title') && $('#view_page #view_title').html()) ? $('#view_page #view_title').html().trim() : ''; //流程标题
        requestName = ($('#requestnamespan') && $('#requestnamespan').html() && $('#requestnamespan').html().trim()) ? $('#requestnamespan').html().trim().slice(-4) : ''; //流程子标题
    } catch (error) {
        console.log(error);
    }
    const flag = (isNull(requestName) || requestName.includes('加密'));
    return flag;
}
/**
 * @function 检查当前是否是Windows系统
 */
function isWindowsNT() {
    const isWindows = navigator.userAgent.toLowerCase().includes('windows nt'); //检查是否是Windows环境
    return isWindows; //返回检查Windows系统结果
}

function isMacOSX() {
    const isMacOSX = navigator.userAgent.toLowerCase().includes('mac os x'); //检查是否是MacOSX环境
    return isMacOSX; //返回检查MacOSX系统结果
}

/**
 * @function 提示消息
 * @param {*} message
 */
function messaging(message) {
    if (isTransDownFile() && isWindows) {
        window.alert(message);
    }
}

/**
 * @function 判断字符串是否为空
 * @param {*} str
 */
function isNull(str) {
    return typeof str === 'undefined' || str == null || str.trim() === '';
}

/**
 * @function 添加下载按钮函数
 */
function downloadButton() {

    var bodyLength = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').length;
    var downloadLength = $('#rightBox').find('#null_box').find('input[title="下载"]').length;
    var fileinfo = $('td[name="appendixDatasField"]').find('div span').attr('onClick');
    var wedownloadLength = $('#wework-download-button').length;

    if (isTransDownFile()) {

        if (bodyLength > 0 && downloadLength <= 0) {
            const title = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]')
                .find('div span a[onmouseover="changefileaon(this)"]')
                .attr('title');
            const fileID = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]')
                .find('div span a[onmouseover="changefileaon(this)"]')
                .attr('onClick')
                .split(';')[1].split(',')[2].replace(/\"|\'/g, "");
            $('#rightBox').find('#null_box').find('input[title="打印"]')
                .after('<input type="button" class="e8_btn_top" value="下载" title="下载" onclick="downloadFile(\'' + title + '\',' + fileID + ')" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">');
        }

        if (fileinfo != null && typeof fileinfo !== 'undefined' && wedownloadLength <= 0) {

            const args = $('td[name="appendixDatasField"]').find('div span').attr('onClick')
                .replace(/toDownload|\'/g, '')
                .slice(1, -2)
                .split(',');
            const title = args[1];
            const fileID = args[0];

            //是否显示下载按钮
            const isDisplay = isWindows ? 'display:none;' : "display:none;";

            $($('.excelMainTable tbody tr')[1]).find('td div').css('position', 'relative')
                .css('font-size', '14px!important');
            $($('.excelMainTable tbody tr')[1]).find('td div').append('<input id="wework-download-button" type="button" class="e8_btn_top" style="' + isDisplay + 'float:right;max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;font-size:12px!important;transform: scale(0.8); position: absolute;right: -10px!important; background: #007AFF;color: #fefefe!important;border: 0px solid #fefefe;border-radius: 5px; top: 15px;" value="下载" title="下载" onclick="downloadAllFiles()" />');

            setTimeouts(function() {
                downloadFile('', '');
            }, 300);
        }
    }

}

/**
 * @function 下载所有文件
 */
function downloadAllFiles() {

    const files = fileArray.filter((item, index) => {
        const nindex = fileArray.findIndex(elem => { return elem.fileID == item.fileID });
        return nindex === index;
    });

    files.map((item, index) => {

        const element = JSON.parse(JSON.stringify(item));

        if (index === 0) {
            return downloadSingleFile(element.title, element.fileID);
        }

        setTimeout(() => {
            downloadSingleFile(element.title, element.fileID);
        }, 9000 * index + Math.random() * 1000);

        return 'success';
    });
}

/**
 * @function 下载文件函数
 * @param {*} title
 * @param {*} fileID
 */
function downloadFile(title, fileID) {

    if (isTransDownFile()) {

        $('td[name="appendixDatasField"]').find('div span').each((item, elem) => {
            const args = $(elem).attr('onClick').replace(/toDownload|\'/g, '')
                .slice(1, -2)
                .split(',');
            const title = args[1];
            const fileID = args[0];

            fileArray.push({ title, fileID });

            $(elem).click(function() {
                downloadSingleFile(`` + title + ``, `` + fileID + ``);
                //messaging('downloadSingleFile(title, fileID)' + title + ` : ` + fileID);
            });
            //messaging('downloadSingleFile(title, fileID)');
            //downloadSingleFile(title, fileID);
        });

        //设置下载函数
        window.toDownloadOrigin = window.toDownload;

        //绑定执行下载函数（原OA下载函数）
        window.toDownload = (fileID, title) => {

            if (isTransDownFile() && isWindows) {
                window.open(fileApiURL + fileID, '_blank');
            }

            if (isTransDownFile() && !isWindows) {
                downloadSingleFile(title, fileID);
            }
        };
    }
}


if (isTransDownFile()) {

    //设置下载函数
    window.toDownloading = window.toDownload;

    /**
     * @function 执行下载函数（原OA下载函数）
     * @param {*} fileID
     * @param {*} title
     */
    function toDownload(fileID, title) {

        if (isTransDownFile() && isWindows) {
            window.open(fileApiURL + fileID, '_blank');
        }

        if (isTransDownFile() && !isWindows) {
            downloadSingleFile(title, fileID);
        }
    }

}

/**
 * @function 下载单个文件函数
 * @param {*} title
 * @param {*} fileID
 */
function downloadSingleFile(title, fileID) {

    //messaging(' enter downloadSingleFile : title is ' + title + ' fileID is ' + fileID);

    if (isTransDownFile() && !isWindows) {

        var url = apiURL + `/imagefile/imagefileid?_order=imagefileid&_where=(imagefileid,eq,` + fileID + `)&_fields=TokenKey,fileSize,filerealpath,imagefilename,imagefileid,imagefiletype`;

        try {
            superagent.get(url).then(res => {
                fileMap(res.body);
            });
        } catch (error) {
            console.log(error);
        }

        try {
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(arr) {
                return fileMap(arr);
            });
        } catch (error) {
            console.log(error);
        }

        console.log(`title: , fileID:`);
    }

    return 'success';

}

/**
 * @function 文件遍历下载函数（如果含有多个文件，则批量下载下来）
 * @param {*} arr
 */
function fileMap(arr) {

    const key = window.btoa(window.encodeURIComponent(JSON.stringify(arr))).slice(0, 128);
    const value = window.localStorage.getItem(key);
    const timestamp = new Date().getTime();

    if (value != null && typeof value !== 'undefined' && timestamp <= value) {
        return;
    }

    if (arr == null || typeof arr === 'undefined') {
        return;
    }

    window.localStorage.setItem(key, new Date().getTime() + 5000);

    arr.map(item => {

        const durl = downApiURL + window.btoa(window.encodeURIComponent(item.imagefilename)) + '/' + window.btoa(item.TokenKey.replace('.wfile', '.zip'));
        const name = window.decodeURIComponent(item.imagefilename);
        const suffix = name.slice(name.lastIndexOf('.'));
        const prefix = name.slice(0, name.lastIndexOf('.'));
        const pinyinName = pinyinlite(prefix).flat().join("_");
        const uagent = userAgent.toLowerCase();
        const pcflag = (uagent.toLowerCase().includes('macintosh') && uagent.includes('mac os x')) || (uagent.includes('windows'));

        try {
            if (pcflag) {
                downloadURL(durl, item.imagefilename);
                //messaging(' enter pc downloading file : name is ' + item.imagefilename + ' url is ' + durl);
            } else {
                window.saveAs(durl, item.imagefilename);
                //messaging(' enter mobile downloading file : name is ' + item.imagefilename + ' url is ' + durl);
            }
        } catch (error) {
            console.log(error);
            return 'error';
        }

        return 'success';

    });
}

/**
 * @function 下载文件（通过A标签）
 * @param {*} href
 * @param {*} title
 */
function downloadURL(href, title) {

    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', title);
    a.href = href;
    a.download = title;
    a.click();

}

/**
 * @function 执行快速下载功能
 * @param {*} fileID 
 */
function downloadFileQuick(fileID) {
    //文件下载调用接口
    var fileApiURL = window.location.protocol + `//` + hostnameValue + `:` + port + `/jeecg-boot/api/v1/file/query/`;

    //如果是IP,则换成域名
    if (isValidIP(hostnameValue) && isOuterIP(hostnameValue)) {
        fileApiURL = "http://qy.leading-group.com:8082/jeecg-boot/api/v1/file/query/";
    }

    //打开页面
    window.open(fileApiURL + fileID, '_blank');

}

//执行定时任务
setTimeouts(function() {
    downloadButton();
}, 300, 500, 700, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000);


curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07b69342-4b35-4b2e-ad69-249e23c57c21'\ -
    H 'Content-Type: application/json'\ -
    d '{
"msgtype": "news",
"news": {
    "articles": [{
        "title": "用印资料归档处理",
        "description": "@财务同事 @档案同事 领取已用印资料进行归档处理！",
        "url": "www.qq.com",
        "picurl": "https://pan.yunwisdom.club:30443/api/alien/download/780a213c-47dd-41e7-48b1-276d42f96998/message-background.jpg"
    }]
}
}
'

curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07b69342-4b35-4b2e-ad69-249e23c57c21'\ -
    H 'Content-Type: application/json'\ -
    d '{
"msgtype": "news",
"news": {
    "articles": [{
        "title": "用印申请处理",
        "description": "@印章管理员 @陈乐丽 已提交用印登记信息，请及时处理用印申请！",
        "url": "www.qq.com",
        "picurl": "https://pan.yunwisdom.club:30443/api/alien/download/780a213c-47dd-41e7-48b1-276d42f96998/message-background.jpg"
    }]
}
}
'

curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2da6821a-36d3-495b-8092-7220066a0cd8'\ -
    H 'Content-Type: application/json'\ -
    d '{
"msgtype": "news",
"news": {
    "articles": [{
        "title": "用印申请处理",
        "description": "@印章管理员 @陈乐丽 已提交用印登记信息，请及时处理用印申请！",
        "url": "www.qq.com",
        "picurl": "https://pan.yunwisdom.club:30443/api/alien/download/780a213c-47dd-41e7-48b1-276d42f96998/message-background.jpg"
    }]
}
}
'



curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07b69342-4b35-4b2e-ad69-249e23c57c21'\ -
    H 'Content-Type: application/json'\ -
    d '{
"msgtype": "news",
"news": {
    "articles": [{
        "title": "用印资料移交处理",
        "description": "@前台同事 @周雪丽 用印资料已被领取，即将移交至前台，请及时处理用印资料的移交申请！",
        "url": "www.qq.com",
        "picurl": "https://pan.yunwisdom.club:30443/api/alien/download/780a213c-47dd-41e7-48b1-276d42f96998/message-background.jpg"
    }]
}
}
'

curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07b69342-4b35-4b2e-ad69-249e23c57c21'\ -
    H 'Content-Type: application/json'\ -
    d '{
"msgtype": "text",
"text": {
    "content": "好的，已经采集到您的建议，‘小章’，很好的名字！"
}
}
'