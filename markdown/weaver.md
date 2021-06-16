
1. 数据库登录账户
    192.168.2.52:1433/@username:sa/@password:123/@database:newecology

2. 获取文档ID
    $('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('onClick').split(';')[1].split(',')[2].replace(/\"|\'/g, "")

3. 获取文档名称
    $('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('title')

4. 泛微联系
   李冉冉/@phone:1391065217

5. 测试环境
    http://172.18.1.202:90/@username:sysadmin/@password:1

6. 堡垒服务
    https://172.18.254.236/@username:zhaozy/@password:Miazzy@163.com

7. wifi账户
    leading-office/leading123

8. 查询文档
    /api/v1/imagefile?_order=imagefileid&_where=(imagefileid,eq,1085461)~and(imagefilename,like,%27one.pdf%27)&_fields=TokenKey,fileSize,filerealpath,imagefilename,imagefileid,imagefiletype

9. switchhost
    https://github.com/oldj/SwitchHosts/releases

10. 执行cmd下载文档服务
    mkdir -p /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/;
    mkdir -p /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/unzip/202008/S/;
    curl -XGET http://172.18.1.202:8000/202008/S/c3581392-515d-4ac0-a87a-2e34b15e52e9.zip --output /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/c3581392-515d-4ac0-a87a-2e34b15e52e9.zip ;
    unzip /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/c3581392-515d-4ac0-a87a-2e34b15e52e9.zip -d /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/;
    mv /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/c3581392-515d-4ac0-a87a-2e34b15e52e9 /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/one.pptx;
    cp /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/202008/S/one.pptx /Users/yunwisdom/Workspace/jeecg-boot-v2.1.3/unzip/202008/S/one.pptx;

11. 执行附件下载前端
    
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Miazzy/yunwisdoms@v8.0.0/cdn/common/superagent.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Miazzy/yunwisdoms@v8.0.0/cdn/common/FileSaver.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Miazzy/yunwisdoms@r2.0.5/cdn/common/pinyinlite_full.min.js"></script>
    <script type="text/javascript" src="https://book-hub.oss-cn-beijing.aliyuncs.com/cdn/workflow.downfile.js"></script>

12.  数据库配置文件存放路径
    ecology/web-inf/prop/weaver.properties

13.  nginx暴露文档配置
    
    server {
        listen 8000;

        root /usr/share/nginx/html;

        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 1;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;

        gzip_vary on;
        gzip_disable "MSIE [1-6]\.";
        gzip_buffers 32 4k;
        gzip_http_version 1.0;

        location ^~ / {
            root   /root/jeecg/upFiles/;
            index  index.html index.htm;

            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET, DELETE, PUT';
            add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';

        }	
    }

14. mysql8.0创建账户

    create user 'zhaoziyun'@'%' identified WITH mysql_native_password by 'ziyequma';
    grant all privileges on `jeecg-boot`.* to 'zhaoziyun'@'%';
    flush privileges; 

15. 泛微ecology数据库配置文件
    
    ecology/web-inf/prop/weaver.properties

16. 加密附件下载功能

```js
$('#rightBox').find('#null_box').find('input[title="打印"]').after('<input type="button" class="e8_btn_top" value="下载" title="下载" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">')

$('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('title')

$('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('onClick').split(';')[1].split(',')[2].replace(/\"|\'/g, "")

fetch('http://192.168.2.52:7001/api/v1/imagefile?_order=imagefileid&_where=(imagefileid,eq,1085461)~and(imagefilename,like,%27one.pdf%27)&_fields=TokenKey,fileSize,filerealpath,imagefilename,imagefileid,imagefiletype')
  .then(function(response) {
    return response.json();
  })
```

http://172.18.1.202:7001/api/v1/filebase/cesi.xlsx/MjAyMDA4L0wvYmI0ZTMwZTQtNjFjZi00ZWNkLWIyOWQtMGRhYmZkMjIwYWMwLnppcA==

<script async defer type="text/javascript" src=//cdn.jsdelivr.net/gh/Miazzy/yunwisdoms@v8.0.0/cdn/common/FileSaver.min.js></script>

```js
async saveAsFile(file , name){
        try {
          window.saveAs(file , name);
        } catch (error) {
          console.log(error);
        }
      },
//前端代码

    setTimeout(function(){
		downloadButton();
	},3000);
	setTimeout(function(){
		downloadButton();
	},5000);
	setTimeout(function(){
		downloadButton();
	},7000);
	setTimeout(function(){
		downloadButton();
	},9000);
	setTimeout(function(){
		downloadButton();
	},11000);

	function downloadButton(){
		var bodyLength = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').length;
		var downloadLength = $('#rightBox').find('#null_box').find('input[title="下载"]').length;
		if(bodyLength > 0 && downloadLength <= 0){
			var title = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('title')
			var fileID = $('#bodyiframe').contents().find('table[_target="mainFileUploadField"]').find('div span a[onmouseover="changefileaon(this)"]').attr('onClick').split(';')[1].split(',')[2].replace(/\"|\'/g, "")
			$('#rightBox').find('#null_box').find('input[title="打印"]').after('<input type="button" class="e8_btn_top" value="下载" title="下载" onclick="downloadFile(\''+title+'\','+fileID+')" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">')
		}
	}

	function downloadFile(title,fileID) {

		let apiURL = `http://172.18.1.202:7001/api/v1`;
		let downApiURL = `http://172.18.1.202:7001/api/v1/filebase/`;

		let url = apiURL + `/imagefile?_order=imagefileid&_where=(imagefileid,eq,` + fileID + `)~and(imagefilename,like,%27` + title + `%27)&_fields=TokenKey,fileSize,filerealpath,imagefilename,imagefileid,imagefiletype`;
		
		fetch(url).then(function(response) {
			return response.json();
		}).then(function(arr){
			let durl = downApiURL + window.btoa(window.encodeURIComponent(arr[0].imagefilename)) + '/'+ window.btoa(arr[0].TokenKey.replace('.wfile','.zip'));
			try {
				window.saveAs(durl , arr[0].imagefilename);
			} catch (error) {
				console.log(error);
			}
		})
		
		console.log(`title:${title} , fileID:${fileID}`);

	}
```
<script async defer type="text/javascript" src=//cdn.jsdelivr.net/gh/Miazzy/yunwisdoms@v8.0.0/cdn/common/FileSaver.min.js></script>
