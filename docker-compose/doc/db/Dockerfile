FROM mysql:8.0.19

MAINTAINER jeecgos@163.com

ENV TZ=Asia/Shanghai

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./jeecgcloud_mysql5.7.sql /docker-entrypoint-initdb.d


RUN mkdir -p /jeecg-cloud-mysql
COPY ./nacos-mysql.sql /jeecg-cloud-mysql