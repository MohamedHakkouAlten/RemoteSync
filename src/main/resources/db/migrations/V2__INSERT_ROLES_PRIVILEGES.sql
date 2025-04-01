INSERT INTO remotesync.role (role_id, authority) VALUES (1, 'ROLE_ADMIN');
INSERT INTO remotesync.role (role_id, authority) VALUES (2, 'ROLE_ASSOCIATE');
INSERT INTO remotesync.role (role_id, authority) VALUES (3, 'ROLE_RC');


INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (1, 'ADMIN:READ_SUB_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (2, 'RC:WRITE');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (3, 'ADMIN:READ_CLIENT');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (4, 'RC:READ');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (5, 'ADMIN:READ_USER');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (6, 'ADMIN:UPDATE_SUB_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (7, 'ADMIN:UPDATE_CLIENT');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (8, 'ADMIN:UPDATE_PROJECTS');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (9, 'ADMIN:WRITE_USER');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (10, 'RC:READ_REQUEST');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (11, 'ADMIN:WRITE_PROJECTS');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (12, 'ADMIN:WRITE_CLIENT');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (13, 'ADMIN:READ_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (14, 'RC:UPDATE_ROTATION');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (15, 'ADMIN:READ_PROJECTS');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (16, 'ADMIN:UPDATE_USER');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (17, 'RC:UPDATE_REQUEST');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (18, 'ADMIN:WRITE_SUB_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (19, 'ADMIN:UPDATE_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (20, 'ADMIN:WRITE_FACTORY');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (21, 'UPDATE_PROFILE');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (22, 'ADMIN:READ_LOGS');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (23, 'ASSOCIATE:REQUEST');
INSERT INTO remotesync.privilege (privilege_id, authority) VALUES (24, 'ASSOCIATE:READ');


INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (1, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (2, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (3, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (4, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (5, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (6, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (7, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (8, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (9, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (10, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (11, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (12, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (13, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (14, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (15, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (16, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (17, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (18, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (19, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (20, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (21, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (22, 1);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (23, 2);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (24, 2);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (21, 2);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (17, 3);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (14, 3);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (2, 3);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (10, 3);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (4, 3);
INSERT INTO remotesync.role_privileges (privileges_privilege_id, roles_role_id) VALUES (21, 3);
