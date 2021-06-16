create or replace  view v_admin as select `jeecg`.`sys_user`.`id` AS `id`, `jeecg`.`sys_user`.`username` AS `username`
from `jeecg`.`sys_user`
where `jeecg`.`sys_user`.`id` in (select distinct `user`.`user_id`
                                  from ((select `jeecg`.`sys_role`.`id`        AS `id`,
                                                `jeecg`.`sys_role`.`role_name` AS `role_name`
                                         from `jeecg`.`sys_role`
                                         where (`jeecg`.`sys_role`.`role_name` like '%管理员%')) `role`
                                           left join `jeecg`.`sys_user_role` `user`
                                                     on ((`user`.`role_id` = `role`.`id`))));

create or replace  view v_author as select `tmp`.`username`                                                                               AS `username`,
       `tmp`.`blogs`                                                                                  AS `blogs`,
       `tmp`.`visits`                                                                                 AS `visits`,
       `tmp`.`stars`                                                                                  AS `stars`,
       `tmp`.`favors`                                                                                 AS `favors`,
       round(((((`tmp`.`blogs` * 5) + (`tmp`.`visits` / 1000)) + `tmp`.`stars`) + `tmp`.`favors`), 0) AS `exp`
from (select `jeecg`.`bs_blog`.`create_by`        AS `username`,
             count(`jeecg`.`bs_blog`.`id`)        AS `blogs`,
             sum(`jeecg`.`bs_blog`.`visit_count`) AS `visits`,
             sum(`jeecg`.`bs_blog`.`star`)        AS `stars`,
             sum(`jeecg`.`bs_blog`.`likes`)       AS `favors`
      from `jeecg`.`bs_blog`
      group by `jeecg`.`bs_blog`.`create_by`) `tmp`;

create or replace  view v_author_info as select `t`.`username`        AS `username`,
       `t`.`blogs`           AS `blogs`,
       `t`.`visits`          AS `visits`,
       `t`.`stars`           AS `stars`,
       `t`.`favors`          AS `favors`,
       `t`.`exp`             AS `exp`,
       (case
            when (`t`.`exp` < 1000) then 'lv1'
            when ((`t`.`exp` >= 1000) and (`t`.`exp` < 3000)) then 'lv2'
            when ((`t`.`exp` >= 3000) and (`t`.`exp` < 5000)) then 'lv3'
            when ((`t`.`exp` >= 5000) and (`t`.`exp` < 10000)) then 'lv4'
            when ((`t`.`exp` >= 10000) and (`t`.`exp` < 30000)) then 'lv5'
            when ((`t`.`exp` >= 30000) and (`t`.`exp` < 50000)) then 'lv6'
            when ((`t`.`exp` >= 50000) and (`t`.`exp` < 100000)) then 'lv7'
            when ((`t`.`exp` >= 100000) and (`t`.`exp` < 300000)) then 'lv8'
            when ((`t`.`exp` >= 300000) and (`t`.`exp` < 500000)) then 'lv9'
            else 'lv10' end) AS `level`,
       `t`.`realname`        AS `realname`,
       `t`.`bio`             AS `bio`,
       `t`.`avatar`          AS `avatar`
from (select ifnull(`v`.`username`, `s`.`username`)                        AS `username`,
             ifnull(`v`.`blogs`, 0)                                        AS `blogs`,
             ifnull(`v`.`visits`, 0)                                       AS `visits`,
             ifnull(`v`.`stars`, 0)                                        AS `stars`,
             ifnull(`v`.`favors`, 0)                                       AS `favors`,
             ifnull(`v`.`exp`, 0)                                          AS `exp`,
             ifnull(convert(`s`.`realname` using utf8mb4), `v`.`username`) AS `realname`,
             `s`.`bio`                                                     AS `bio`,
             `s`.`avatar`                                                  AS `avatar`
      from (`jeecg`.`sys_user` `s`
               left join `jeecg`.`v_author` `v` on ((`v`.`username` = `s`.`username`)))) `t`;

create or replace  view v_avatar as select `jeecg`.`sys_user`.`username` AS `username`, `jeecg`.`sys_user`.`avatar` AS `avatar`
from `jeecg`.`sys_user`
where ((`jeecg`.`sys_user`.`avatar` is not null) and (`jeecg`.`sys_user`.`avatar` <> '[]') and
       (`jeecg`.`sys_user`.`avatar` <> ''));

create or replace  view v_depart_name as select `t2`.`org_code`                                                               AS `org_code`,
       `t2`.`id`                                                                     AS `id`,
       concat(ifnull(`t2`.`depart_name`, ''), ' - ', ifnull(`t1`.`depart_name`, '')) AS `name`
from (`jeecg`.`sys_depart` `t2`
         left join `jeecg`.`sys_depart` `t1` on ((`t1`.`id` = `t2`.`parent_id`)));

create or replace  view v_fans as select `jeecg`.`bs_blog_attention`.`watch_user`  AS `username`,
       `jeecg`.`bs_blog_attention`.`create_user` AS `fans`,
       `v_author_info`.`realname`                AS `realname`,
       `v_author_info`.`avatar`                  AS `avatar`,
       `jeecg`.`bs_blog_attention`.`status`      AS `status`
from (`jeecg`.`bs_blog_attention`
         left join `jeecg`.`v_author_info`
                   on ((`jeecg`.`bs_blog_attention`.`create_user` = `v_author_info`.`username`)));

create or replace  view v_handled_events as select `h`.`business_data_id`                                    AS `id`,
       `h`.`id`                                                  AS `pid`,
       (case when (`h`.`action` = '知会') then '知会' else '审批' end) AS `type`,
       `h`.`table_name`                                          AS `tname`,
       `c`.`table_txt`                                           AS `name`,
       `h`.`content`                                             AS `topic`,
       `h`.`employee`                                            AS `username`,
       `h`.`create_time`                                         AS `create_time`,
       `h`.`proponents`                                          AS `proponents`
from (`jeecg`.`pr_log_history` `h`
         left join `jeecg`.`onl_cgform_head` `c` on ((`h`.`table_name` = convert(`c`.`table_name` using utf8mb4))));

create or replace  view v_handled_events_unq as select `sub`.`id`          AS `id`,
       `sub`.`pid`         AS `pid`,
       `sub`.`type`        AS `type`,
       `sub`.`tname`       AS `tname`,
       `sub`.`name`        AS `name`,
       `sub`.`topic`       AS `topic`,
       `sub`.`username`    AS `username`,
       `sub`.`create_time` AS `create_time`,
       `sub`.`proponents`  AS `proponents`,
       `sub`.`unq`         AS `unq`,
       `u`.`realname`      AS `sponsor`
from ((select max(`v_handled_events`.`id`)                                                                          AS `id`,
              max(`v_handled_events`.`pid`)                                                                         AS `pid`,
              max(`v_handled_events`.`type`)                                                                        AS `type`,
              max(`v_handled_events`.`tname`)                                                                       AS `tname`,
              max(`v_handled_events`.`name`)                                                                        AS `name`,
              max(`v_handled_events`.`topic`)                                                                       AS `topic`,
              max(`v_handled_events`.`username`)                                                                    AS `username`,
              max(`v_handled_events`.`create_time`)                                                                 AS `create_time`,
              max(`v_handled_events`.`proponents`)                                                                  AS `proponents`,
              concat(`v_handled_events`.`tname`, ':', `v_handled_events`.`type`, ':', `v_handled_events`.`id`, ':',
                     `v_handled_events`.`username`, ':',
                     date_format(`v_handled_events`.`create_time`, '%Y-%m-%d'))                                     AS `unq`
       from `jeecg`.`v_handled_events`
       group by `unq`) `sub`
         left join `jeecg`.`sys_user` `u` on ((`sub`.`proponents` = convert(`u`.`username` using utf8mb4))));

create or replace  view v_handling_events as select `sub`.`id`          AS `id`,
       `sub`.`pid`         AS `pid`,
       `sub`.`type`        AS `type`,
       `sub`.`tname`       AS `tname`,
       `sub`.`name`        AS `name`,
       `sub`.`topic`       AS `topic`,
       `sub`.`username`    AS `username`,
       `sub`.`user`        AS `user`,
       `sub`.`proponents`  AS `proponents`,
       `sub`.`create_time` AS `create_time`,
       `u`.`realname`      AS `sponsor`
from ((select `h`.`id`          AS `id`,
              `h`.`pid`         AS `pid`,
              `h`.`type`        AS `type`,
              `h`.`name`        AS `tname`,
              `c`.`table_txt`   AS `name`,
              `h`.`topic`       AS `topic`,
              `h`.`username`    AS `username`,
              `h`.`user`        AS `user`,
              `h`.`proponents`  AS `proponents`,
              `h`.`create_time` AS `create_time`
       from (((select `jeecg`.`pr_log`.`business_data_id`          AS `id`,
                      `jeecg`.`pr_log`.`id`                        AS `pid`,
                      '审批'                                         AS `type`,
                      `jeecg`.`pr_log`.`table_name`                AS `name`,
                      `jeecg`.`pr_log`.`content`                   AS `topic`,
                      replace(`jeecg`.`pr_log`.`employee`, '', '') AS `username`,
                      ifnull(`jeecg`.`pr_log`.`approve_user`, '')  AS `user`,
                      ifnull(`jeecg`.`pr_log`.`proponents`, '')    AS `proponents`,
                      `jeecg`.`pr_log`.`create_time`               AS `create_time`
               from `jeecg`.`pr_log`)
              union all
              select `jeecg`.`pr_log_informed`.`business_data_id`          AS `id`,
                     `jeecg`.`pr_log_informed`.`id`                        AS `pid`,
                     '知会'                                                  AS `type`,
                     `jeecg`.`pr_log_informed`.`table_name`                AS `name`,
                     `jeecg`.`pr_log_informed`.`content`                   AS `topic`,
                     replace(`jeecg`.`pr_log_informed`.`employee`, '', '') AS `username`,
                     ifnull(`jeecg`.`pr_log_informed`.`approve_user`, '')  AS `user`,
                     ifnull(`jeecg`.`pr_log_informed`.`proponents`, '')    AS `proponents`,
                     `jeecg`.`pr_log_informed`.`create_time`               AS `create_time`
              from `jeecg`.`pr_log_informed`) `h`
                left join `jeecg`.`onl_cgform_head` `c` on ((`h`.`name` = convert(`c`.`table_name` using utf8mb4)))))
      `sub`
         left join `jeecg`.`sys_user` `u` on ((`sub`.`proponents` = convert(`u`.`username` using utf8mb4))));

create or replace  view v_slink as select `jeecg`.`bs_short_link`.`id` AS `id`, `jeecg`.`bs_short_link`.`url` AS `url`
from `jeecg`.`bs_short_link`;

create or replace  view v_table_field as select `f`.`db_field_name` AS `field`, `f`.`db_field_txt` AS `txt`, `h`.`table_name` AS `name`, `f`.`order_num` AS `num`
from (`jeecg`.`onl_cgform_field` `f`
         left join `jeecg`.`onl_cgform_head` `h` on ((`f`.`cgform_head_id` = `h`.`id`)));

create or replace  view v_table_info as select `v_table_field`.`name` AS `id`,
       concat('{', group_concat(concat('"', `v_table_field`.`field`, '":"', `v_table_field`.`txt`, '"') separator ','),
              '}')            AS `value`,
       concat('{', group_concat(concat('"', `v_table_field`.`field`, '":"', `v_table_field`.`num`, '"') separator ','),
              '}')            AS `num`
from `jeecg`.`v_table_field`
where (`v_table_field`.`name` is not null)
group by `v_table_field`.`name`;

create or replace  view v_table_name as select `jeecg`.`onl_cgform_head`.`table_name` AS `id`, `jeecg`.`onl_cgform_head`.`table_txt` AS `name`
from `jeecg`.`onl_cgform_head`;

create or replace  view v_uname as select `v_user`.`username` AS `username`, `v_user`.`realname` AS `realname`
from `jeecg`.`v_user`;

create or replace  view v_user as select `u`.`id`                AS `id`,
       `u`.`username`          AS `username`,
       `u`.`realname`          AS `realname`,
       `u`.`post`              AS `post`,
       `u`.`birthday`          AS `birthday`,
       `u`.`address`           AS `address`,
       `u`.`bio`               AS `bio`,
       `u`.`tags`              AS `tags`,
       `u`.`nickname`          AS `nickname`,
       `u`.`avatar`            AS `avatar`,
       `u`.`idcard`            AS `idcard`,
       `u`.`create_time`       AS `create_time`,
       ifnull(`u`.`email`, '') AS `email`,
       ifnull(`u`.`phone`, '') AS `phone`,
       ifnull(`d`.`name`, '')  AS `name`
from (`jeecg`.`sys_user` `u`
         left join `jeecg`.`v_depart_name` `d` on ((`u`.`org_code` = `d`.`org_code`)));

create or replace  view v_user_monthly as select `t`.`month` AS `month`, count(0) AS `total`
from (select `jeecg`.`sys_user`.`username`                          AS `username`,
             date_format(`jeecg`.`sys_user`.`create_time`, '%Y-%m') AS `month`
      from `jeecg`.`sys_user`) `t`
group by `t`.`month`
order by `t`.`month` desc;

create or replace  view v_visit_month as select count(`t`.`id`) AS `total`, `t`.`m` AS `month`
from (select `jeecg`.`sys_log`.`id` AS `id`, date_format(`jeecg`.`sys_log`.`create_time`, '%Y-%m') AS `m`
      from `jeecg`.`sys_log`) `t`
group by `t`.`m`
order by `t`.`m` desc;

create or replace  view v_visit_total as select `t`.`ctotal` AS `ctotal`, `m`.`vtotal` AS `vtotal`
from ((select count(0) AS `ctotal`
       from `jeecg`.`sys_log`
       where ((to_days(`jeecg`.`sys_log`.`create_time`) - to_days(now())) = 0)) `t`
         join (select count(0) AS `vtotal` from `jeecg`.`sys_log`) `m`);

create or replace  view v_watch as select `attention`.`create_user` AS `username`,
       `attention`.`watch_user`  AS `watch`,
       `author`.`realname`       AS `realname`,
       `author`.`avatar`         AS `avatar`,
       `attention`.`status`      AS `status`
from (`jeecg`.`bs_blog_attention` `attention`
         left join `jeecg`.`v_author_info` `author` on ((`attention`.`watch_user` = `author`.`username`)));

create or replace  view v_workflow_daily as select `v_workflow_total`.`ctime` AS `ctime`, count(`v_workflow_total`.`ctime`) AS `total`
from `jeecg`.`v_workflow_total`
group by `v_workflow_total`.`ctime`
order by `v_workflow_total`.`ctime` desc;

create or replace  view v_workflow_monthly as select `v_workflow_total`.`CMONTH` AS `cmonth`, count(`v_workflow_total`.`CMONTH`) AS `total`
from `jeecg`.`v_workflow_total`
group by `v_workflow_total`.`CMONTH`
order by `v_workflow_total`.`CMONTH` desc;

create or replace  view v_workflow_node as select `t`.`id`      AS `id`,
       `t`.`start`   AS `start`,
       `t`.`audit`   AS `audit`,
       `t`.`approve` AS `approve`,
       `t`.`notify`  AS `notify`
from (select `p`.`main_key`     AS `no`,
             `max`.`id`         AS `id`,
             `p`.`create_by`    AS `start`,
             `p`.`audit_node`   AS `audit`,
             `p`.`approve_node` AS `approve`,
             `p`.`notify_node`  AS `notify`
      from ((select `jeecg`.`bs_free_process`.`main_key` AS `id`, max(`jeecg`.`bs_free_process`.`create_time`) AS `time`
             from `jeecg`.`bs_free_process`
             group by `jeecg`.`bs_free_process`.`main_key`) `max`
               left join `jeecg`.`bs_free_process` `p` on ((`p`.`create_time` = `max`.`time`)))) `t`
where (`t`.`no` = `t`.`id`);

create or replace  view v_workflow_total as select `t`.`main_value` AS `id`, max(`t`.`create_time`) AS `ctime`, max(`t`.`month`) AS `CMONTH`
from (select distinct `l`.`main_value`                           AS `main_value`,
                      date_format(`l`.`create_time`, '%Y-%m-%d') AS `create_time`,
                      date_format(`l`.`create_time`, '%Y-%m')    AS `month`
      from `jeecg`.`pr_log_history` `l`
      union
      select distinct `l`.`main_value`                           AS `main_value`,
                      date_format(`l`.`create_time`, '%Y-%m-%d') AS `create_time`,
                      date_format(`l`.`create_time`, '%Y-%m')    AS `month`
      from `jeecg`.`pr_log` `l`) `t`
group by `t`.`main_value`;

create or replace  view v_workflow_type_node as select `t`.`tname`   AS `tname`,
       `t`.`cname`   AS `cname`,
       `t`.`start`   AS `start`,
       `t`.`audit`   AS `audit`,
       `t`.`approve` AS `approve`,
       `t`.`notify`  AS `notify`
from (select `p`.`table_name`   AS `tbname`,
             `p`.`create_by`    AS `ctname`,
             `max`.`tname`      AS `tname`,
             `max`.`cname`      AS `cname`,
             `p`.`create_by`    AS `start`,
             `p`.`audit_node`   AS `audit`,
             `p`.`approve_node` AS `approve`,
             `p`.`notify_node`  AS `notify`
      from ((select `jeecg`.`bs_free_process`.`table_name`       AS `tname`,
                    `jeecg`.`bs_free_process`.`create_by`        AS `cname`,
                    max(`jeecg`.`bs_free_process`.`create_time`) AS `time`
             from `jeecg`.`bs_free_process`
             group by `jeecg`.`bs_free_process`.`table_name`, `jeecg`.`bs_free_process`.`create_by`) `max`
               left join `jeecg`.`bs_free_process` `p` on ((`p`.`create_time` = `max`.`time`)))) `t`
where ((`t`.`tbname` = `t`.`tname`) and (`t`.`ctname` = `t`.`cname`));

