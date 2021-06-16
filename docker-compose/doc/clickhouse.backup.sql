CREATE TABLE bs_ability_quota ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_ability_quota', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_admin_group ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_admin_group', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_announce ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_announce', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_approve ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_approve', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_approve_general ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_approve_general', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_approve_node ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_approve_node', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_ask_report ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_ask_report', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_attendance ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_attendance', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_attendance_details ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_attendance_details', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_blog ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_blog', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_blog_attention ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_blog_attention', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_blog_tags ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_blog_tags', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_blog_watchtag ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_blog_watchtag', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_blogger ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_blogger', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_bug_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_bug_logging', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_car_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_car_apply', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_comments ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_comments', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_communication ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_communication', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_company_info ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_company_info', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_document ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_document', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_document_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_document_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_dynamic ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_dynamic', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_egress ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_egress', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_entry_job ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_entry_job', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_entry_man ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_entry_man', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_favor_info ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_favor_info', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_free_process ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_free_process', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_free_process_h ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_free_process_h', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_goods ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_goods', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_goods_borrow ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_goods_borrow', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_goods_receive ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_goods_receive', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_home_pictures ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_home_pictures', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_hrmresource ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_hrmresource', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_issue ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_issue', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_job_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_leave ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_leave', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_lost_property ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_lost_property', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_market_info ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_market_info', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_message ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_message', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_mireanna ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_mireanna', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_mireanna_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_mireanna_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_month_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_month_job_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_news ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_news', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_notice ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_notice', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_official_seal ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_official_seal', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_overtime ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_overtime', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_payment ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_payment', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_plan_task ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_plan_task', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_plan_task_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_plan_task_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_plan_task_mission ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_plan_task_mission', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_product_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_product_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_project_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_project_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_purchase ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_purchase', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_purchase_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_purchase_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_quarter_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_quarter_job_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_questions ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_questions', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_questions_rs ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_questions_rs', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_record_borrow ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_record_borrow', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_recruit ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_recruit', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_redhead ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_redhead', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_registor ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_registor', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_regular_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_regular_apply', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reim ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reim', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reim_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reim_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_repair_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_repair_apply', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_report_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_report_job_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_requirement ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_requirement', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reserve ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reserve', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_resign ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_resign', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reward_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reward_apply', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reward_data ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reward_data', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_reward_items ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_reward_items', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_salary ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_salary', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_seal_contract ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_seal_contract', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_seal_declare ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_seal_declare', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_seal_normal ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_seal_normal', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_seal_regist ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_seal_regist', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_seal_registed ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_seal_registed', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_shifts_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_shifts_apply', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_short_link ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_short_link', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_sign ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_sign', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_sign_in ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_sign_in', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_sign_up ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_sign_up', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_sign_work ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_sign_work', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_task_assign ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_task_assign', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_task_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_task_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_team ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_team', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_traffic_allowance ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_traffic_allowance', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_transaction ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_transaction', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_travel ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_travel', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_user_info ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_user_info', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_visit_apply ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_visit_apply', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_visit_appointment ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_visit_appointment', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_wedepart ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_wedepart', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_week_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_week_job_logging', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_wework_depart ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_wework_depart', 'zhaoziyun','ziyequma') ;

CREATE TABLE bs_wework_user ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_wework_user', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_work_contact ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_work_contact', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_work_contact_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_work_contact_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_work_examine ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_work_examine', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_work_examine_items ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_work_examine_items', 'zhaoziyun','ziyequma') ;
CREATE TABLE bs_year_job_logging ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'bs_year_job_logging', 'zhaoziyun','ziyequma') ;

CREATE TABLE pr_business ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_business', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_business_status ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_business_status', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_businesses ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_businesses', 'zhaoziyun','ziyequma') ;

CREATE TABLE pr_collection ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_collection', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_design ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_design', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_flow ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_flow', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_log ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_log', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_log_history ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_log_history', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_log_informed ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_log_informed', 'zhaoziyun','ziyequma') ;

CREATE TABLE pr_rights ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_rights', 'zhaoziyun','ziyequma') ;
CREATE TABLE pr_template ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'pr_template', 'zhaoziyun','ziyequma') ;

CREATE TABLE sys_announcement ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_announcement', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_announcement_send ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_announcement_send', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_category ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_category', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_check_rule ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_check_rule', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_data_log ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_data_log', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_data_source ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_data_source', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_depart ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_depart', 'zhaoziyun','ziyequma') ;

CREATE TABLE sys_depart_permission ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_depart_permission', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_depart_role ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_depart_role', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_depart_role_permission ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_depart_role_permission', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_depart_role_user ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_depart_role_user', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_dict ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_dict', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_dict_item ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_dict_item', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_fill_rule ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_fill_rule', 'zhaoziyun','ziyequma') ;

CREATE TABLE sys_log ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_log', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_permission ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_permission', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_permission_data_rule ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_permission_data_rule', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_position ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_position', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_quartz_job ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_quartz_job', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_role ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_role', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_role_permission ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_role_permission', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_sms ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_sms', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_sms_template ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_sms_template', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_user ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_user', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_user_agent ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_user_agent', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_user_depart ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_user_depart', 'zhaoziyun','ziyequma') ;
CREATE TABLE sys_user_role ENGINE = MergeTree ORDER BY id AS SELECT * FROM mysql('172.18.254.96:4000', 'xdata', 'sys_user_role', 'zhaoziyun','ziyequma') ;
