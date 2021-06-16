FROM redis:5.0

MAINTAINER jzyadmin@163.com

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN mkdir -p /jeecg-cloud-redis

WORKDIR /jeecg-cloud-redis

ADD sentinel.conf ./

CMD redis-server
