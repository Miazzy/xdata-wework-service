DROP DATABASE IF EXISTS `jeecg-nacos`;
create database `jeecg-nacos` default character set utf8mb4 collate utf8mb4_general_ci;


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `jeecg-nacos`;

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info   */
/******************************************/
CREATE TABLE `config_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  `c_desc` varchar(256) DEFAULT NULL,
  `c_use` varchar(64) DEFAULT NULL,
  `effect` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `c_schema` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';


INSERT INTO `jeecg-nacos`.config_info (id, data_id, group_id, content, md5, gmt_create, gmt_modified, src_user, src_ip, app_name, tenant_id, c_desc, c_use, effect, type, c_schema) VALUES (1, 'application-jeecg-cloud-dev.yml', 'DEFAULT_GROUP', 'server:
  tomcat:
    max-swallow-size: -1
  compression:
    enabled: true
    min-response-size: 1024
    mime-types: application/javascript,application/json,application/xml,text/html,text/xml,text/plain,text/css,image/*

management:
 health:
   mail:
     enabled: false
 endpoints:
   web:
     exposure:
      include: ''*''
 endpoint:
   health:
     show-details: always

spring:
  rabbitmq:
    host: localhost
    #账号密码 默认有的
    username: guest
    password: guest
    #rbbitmq虚拟主机路径
    virtual-host: /
    #rabbitmq的端口号 也是默认的
    port: 5672
  servlet:
     multipart:
        max-file-size: 10MB
        max-request-size: 10MB
  mail:
    host: smtp.163.com
    username: jeecgos@163.com
    password: ??
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
  ## quartz定时任务,采用数据库方式
  quartz:
    job-store-type: jdbc
    initialize-schema: embedded
    #设置自动启动，默认为 true
    auto-startup: true
    #启动时更新己存在的Job
    overwrite-existing-jobs: true
    properties:
      org:
        quartz:
          scheduler:
            instanceName: MyScheduler
            instanceId: AUTO
          jobStore:
            class: org.quartz.impl.jdbcjobstore.JobStoreTX
            driverDelegateClass: org.quartz.impl.jdbcjobstore.StdJDBCDelegate
            tablePrefix: QRTZ_
            isClustered: true
            misfireThreshold: 60000
            clusterCheckinInterval: 10000
          threadPool:
            class: org.quartz.simpl.SimpleThreadPool
            threadCount: 10
            threadPriority: 5
            threadsInheritContextClassLoaderOfInitializingThread: true
  #json 时间戳统一转换
  jackson:
    date-format:   yyyy-MM-dd HH:mm:ss
    time-zone:   GMT+8
  aop:
    proxy-target-class: true
  activiti:
    check-process-definitions: false
    #启用作业执行器
    async-executor-activate: false
    #启用异步执行器
    job-executor-activate: false
  jpa:
    open-in-view: false
  #配置freemarker
  freemarker:
    # 设置模板后缀名
    suffix: .ftl
    # 设置文档类型
    content-type: text/html
    # 设置页面编码格式
    charset: UTF-8
    # 设置页面缓存
    cache: false
    prefer-file-system-access: false
    # 设置ftl文件路径
    template-loader-path:
      - classpath:/templates
  # 设置静态文件路径，js,css等
  mvc:
    static-path-pattern: /**
  resource:
    static-locations: classpath:/static/,classpath:/public/
  autoconfigure:
    exclude: com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure
  datasource:
    druid:
      stat-view-servlet:
        enabled: true
        loginUsername: admin
        loginPassword: 123456
        allow:
      web-stat-filter:
        enabled: true
    dynamic:
      druid: # 全局druid参数，绝大部分值和默认保持一致。(现已支持的参数如下,不清楚含义不要乱设置)
        # 连接池的配置信息
        # 初始化大小，最小，最大
        initial-size: 5
        min-idle: 5
        maxActive: 20
        # 配置获取连接等待超时的时间
        maxWait: 60000
        # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
        timeBetweenEvictionRunsMillis: 60000
        # 配置一个连接在池中最小生存的时间，单位是毫秒
        minEvictableIdleTimeMillis: 300000
        validationQuery: SELECT 1 FROM DUAL
        testWhileIdle: true
        testOnBorrow: false
        testOnReturn: false
        # 打开PSCache，并且指定每个连接上PSCache的大小
        poolPreparedStatements: true
        maxPoolPreparedStatementPerConnectionSize: 20
        # 配置监控统计拦截的filters，去掉后监控界面sql无法统计，''wall''用于防火墙
        filters: stat,wall,slf4j
        # 通过connectProperties属性来打开mergeSql功能；慢SQL记录
        connectionProperties: druid.stat.mergeSql\\=true;druid.stat.slowSqlMillis\\=5000
      datasource:
        master:
          url: jdbc:mysql://jeecg-cloud-mysql:3306/jeecg-cloud?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true
          username: root
          password: root
          driver-class-name: com.mysql.jdbc.Driver
          # 多数据源配置
          #multi-datasource1:
          #url: jdbc:mysql://localhost:3306/jeecg-cloud2?useUnicode=true&characterEncoding=utf8&autoReconnect=true&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true
          #username: root
          #password: root
          #driver-class-name: com.mysql.jdbc.Driver
  #redis 配置
  redis:
    database: 0
    host: jeecg-cloud-redis
    lettuce:
      pool:
        max-active: 8   #最大连接数据库连接数,设 0 为没有限制
        max-idle: 8     #最大等待连接中的数量,设 0 为没有限制
        max-wait: -1ms  #最大建立连接等待时间。如果超过此时间将接到异常。设为-1表示无限制。
        min-idle: 0     #最小等待连接中的数量,设 0 为没有限制
      shutdown-timeout: 100ms
    password: ''''
    port: 6379
#mybatis plus 设置
mybatis-plus:
  mapper-locations: classpath*:org/jeecg/modules/**/xml/*Mapper.xml
  global-config:
    # 关闭MP3.0自带的banner
    banner: false
    db-config:
      #主键类型  0:"数据库ID自增",1:"该类型为未设置主键类型", 2:"用户输入ID",3:"全局唯一ID (数字类型唯一ID)", 4:"全局唯一ID UUID",5:"字符串全局唯一ID (idWorker 的字符串表示)";
      id-type: ID_WORKER_STR
      # 默认数据库表下划线命名
      table-underline: true
  configuration:
    # 这个配置会将执行的sql打印出来，在开发或测试的时候可以用
    #log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    # 返回类型为Map,显示null对应的字段
    call-setters-on-nulls: true
#jeecg专用配置
jeecg :
  # 本地：local\\Minio：minio\\阿里云：alioss
  uploadType: local
  path :
    #文件上传根目录 设置
    upload: D://opt//upFiles
    #webapp文件路径
    webapp: D://opt//webapp
  #短信秘钥
  sms:
     accessKeyId: ??
     accessKeySecret: ??
  shiro:
     excludeUrls: /test/jeecgDemo/demo3,/test/jeecgDemo/redisDemo/**
  #阿里云oss存储配置
  oss:
    endpoint: oss-cn-beijing.aliyuncs.com
    accessKey: ??
    secretKey: ??
    bucketName: jeecgos
    staticDomain: https://static.jeecg.com
  # ElasticSearch 6设置
  elasticsearch:
    cluster-name: jeecg-ES
    cluster-nodes: 127.0.0.1:9200
    check-enabled: false
  # 表单设计器配置
  desform:
    # 主题颜色（仅支持 16进制颜色代码）
    theme-color: "#1890ff"
  # 在线预览文件服务器地址配置
  file-view-domain: http://fileview.jeecg.com
  # minio文件上传
  minio:
    minio_url: http://minio.jeecg.com
    minio_name: ??
    minio_pass: ??
    bucketName: otatest
#Mybatis输出sql日志
logging:
  level:
    org.jeecg.modules.system.mapper : debug
#cas单点登录
cas:
  prefixUrl: http://cas.example.org:8443/cas
#enable swagger
swagger:
  enable: true', '0cae8e37ccd61ed8864ca5b66dbc477e', '2020-08-20 04:39:17', '2020-08-20 04:39:17', null, '172.24.0.1', '', '', null, null, null, 'yaml', null);
INSERT INTO `jeecg-nacos`.config_info (id, data_id, group_id, content, md5, gmt_create, gmt_modified, src_user, src_ip, app_name, tenant_id, c_desc, c_use, effect, type, c_schema) VALUES (2, 'jeecg-cloud-gateway-dev.yml', 'DEFAULT_GROUP', 'spring:
  redis:
    host: jeecg-cloud-redis
    password: ''''
    port: 6379
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
      globalcors:
        cors-configurations:
          ''[/**]'':
            allowCredentials: true
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"
      routes:
        #nacos
        - id: jeecg-cloud-demo-biz
          uri: lb://jeecg-cloud-demo-biz
          predicates:
          - Path=/demo/**
          #限流配置
          filters:
          - name: RequestRateLimiter
            args:
              key-resolver: ''#{@ipKeyResolver}''
              redis-rate-limiter.replenishRate: 10
              redis-rate-limiter.burstCapacity: 20
          #降级配置
          - name: Hystrix
            args:
              name: default
              fallbackUri: ''forward:/fallback''
        - id: jeecg-cloud-system-biz
          uri: lb://jeecg-cloud-system-biz
          predicates:
          - Path=/sys/**,/test/**,/online/**,/api/**,/big/screen/**,/bigscreen/**,/webSocketApi/**,/message/**
          #限流配置
          filters:
          - name: RequestRateLimiter
            args:
              key-resolver: ''#{@ipKeyResolver}''
              redis-rate-limiter.replenishRate: 10
              redis-rate-limiter.burstCapacity: 20
          #降级配置
          - name: Hystrix
            args:
              name: default
              fallbackUri: ''forward:/fallback''
        - id: jeecg-cloud-websocket
          uri: lb:ws://jeecg-cloud-system-biz
          predicates:
            - Path=/websocket/**
management:
  endpoints:
    web:
      exposure:
        include: ''*''
# hystrix 信号量隔离，3秒后自动超时
hystrix:
  command:
    default:
      execution:
        isolation:
          strategy: SEMAPHORE
          thread:
            timeoutInMilliseconds: 3000
  shareSecurityContext: true
# 验证配置生效
jeecg:
  test: 123456', '3c2f47f9eafc70066d2c0f150c1d4be2', '2020-08-20 04:39:39', '2020-08-20 04:40:05', null, '172.24.0.1', '', '', '', '', '', 'yaml', '');
/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_aggr   */
/******************************************/
CREATE TABLE `config_info_aggr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) NOT NULL COMMENT 'group_id',
  `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
  `content` longtext NOT NULL COMMENT '内容',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='增加租户字段';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_beta   */
/******************************************/
CREATE TABLE `config_info_beta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_tag   */
/******************************************/
CREATE TABLE `config_info_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_tags_relation   */
/******************************************/
CREATE TABLE `config_tags_relation` (
  `id` bigint(20) NOT NULL COMMENT 'id',
  `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
  `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `nid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = group_capacity   */
/******************************************/
CREATE TABLE `group_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID，空字符表示整个集群',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数，，0表示使用默认值',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='集群、各Group容量信息表';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = his_config_info   */
/******************************************/
CREATE TABLE `his_config_info` (
  `id` bigint(64) unsigned NOT NULL,
  `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data_id` varchar(255) NOT NULL,
  `group_id` varchar(128) NOT NULL,
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL,
  `md5` varchar(32) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
  `src_user` text,
  `src_ip` varchar(20) DEFAULT NULL,
  `op_type` char(10) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`nid`),
  KEY `idx_gmt_create` (`gmt_create`),
  KEY `idx_gmt_modified` (`gmt_modified`),
  KEY `idx_did` (`data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='多租户改造';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = tenant_capacity   */
/******************************************/
CREATE TABLE `tenant_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='租户容量信息表';


CREATE TABLE `tenant_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `kp` varchar(128) NOT NULL COMMENT 'kp',
  `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
  `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
  `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
  `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
  `gmt_create` bigint(20) NOT NULL COMMENT '创建时间',
  `gmt_modified` bigint(20) NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';

CREATE TABLE users (
	username varchar(50) NOT NULL PRIMARY KEY,
	password varchar(500) NOT NULL,
	enabled boolean NOT NULL
);

CREATE TABLE roles (
	username varchar(50) NOT NULL,
	role varchar(50) NOT NULL,
	constraint uk_username_role UNIQUE (username,role)
);

CREATE TABLE permissions (
    role varchar(50) NOT NULL,
    resource varchar(512) NOT NULL,
    action varchar(8) NOT NULL,
    constraint uk_role_permission UNIQUE (role,resource,action)
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');

SET FOREIGN_KEY_CHECKS = 1;