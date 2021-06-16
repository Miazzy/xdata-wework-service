Jeecg-Cloud Redis集群搭建
===============

- 基于Redis5.0

### redis集群环境搭建
#### 本地环境的集群搭建(windows)，windows环境集群访问不了
[local集群配置文件](./docker-compose-redis-local.yml)
- 执行并且创建3台redis
```
docker-compose -f docker-compose-redis-local.yml build 192.168.1.11
```
- 进入任意一台的redis环境中，执行
```
redis-cli --cluster create 172.27.0.2:6379 172.27.0.3:6379 172.27.0.4:6379
```
#### server环境的集群搭建(linux),推荐使用
[local集群配置文件](./docker-compose-redis-server.yml)
- 使用本地集群环境创建一个192.168.1.11镜像，并上传
```
docker-compose -f docker-compose-redis-local.yml build 192.168.1.11
docker tag 192.168.1.11 192.168.1.11:5000/192.168.1.11:1.0
docker push 192.168.1.11:5000/192.168.1.11:1.0
```
- linux端执行,启动redis
```
docker-compose -f docker-compose-redis-server.yml
```
- 进入任意一台redis中执行
```
redis-cli --cluster create 192.168.1.11:6379 192.168.1.11:6380 192.168.1.11:6381
```
- 哨兵启动，进入每一台redis中执行,端口需要做调整避免端口冲突
```
redis-sentinel sentinel.conf
```

### 集群成功后需要增加配置到nacos配置中心中
- 集群添加 （spring.redis）下
```
cluster:
  nodes:
    - 192.168.1.11:6379
    - 192.168.1.11:6380
    - 192.168.1.11:6381
```
- 哨兵添加 （spring.redis）下
```
sentinel:
  master: mymaster
  nodes:
    - 192.168.1.11:26379
    - 192.168.1.11:26380
    - 192.168.1.11:26381
```


### 可能会遇到的坑
- 测试是否搭建成功，记得一定要有 -c 才能进入集群环境
```
redis-cli -c -p 6379
```
- windows环境搭建测试成功但是项目无法连接
```
根据官方资料来看，具体原文放在下面了
    redis cluster只支持docker使用host模式进行集群
    docker windows不支持docker使用host模式
那位大牛有什么解决办法，可以发邮件给我，我维护进去
```
redis
```
Redis Cluster and Docker
Currently Redis Cluster does not support NATted environments and in general environments where IP addresses or TCP ports are remapped.

Docker uses a technique called port mapping: programs running inside Docker containers may be exposed with a different port compared to the one the program believes to be using. This is useful in order to run multiple containers using the same ports, at the same time, in the same server.

In order to make Docker compatible with Redis Cluster you need to use the host networking mode of Docker. Please check the --net=host option in the Docker documentation for more information.
```
docker
```
The host networking driver only works on Linux hosts, and is not supported on Docker Desktop for Mac, Docker Desktop for Windows, or Docker EE for Windows Server.
```