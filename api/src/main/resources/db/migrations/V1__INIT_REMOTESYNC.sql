CREATE TABLE assigned_rotation
(
    rotation_assignment_status VARCHAR(255) NULL,
    override_date              date NULL,
    created_at                 date NULL,
    updated_at                 date NULL,
    created_by_user_id         BINARY(16)   NULL,
    updated_by_user_id         BINARY(16)   NULL,
    user_user_id               BINARY(16)   NOT NULL,
    rotation_rotation_id       BINARY(16)   NOT NULL,
    project_project_id         BINARY(16)   NOT NULL,
    CONSTRAINT pk_assignedrotation PRIMARY KEY (user_user_id, rotation_rotation_id, project_project_id)
);

CREATE TABLE client
(
    client_id  BINARY(16)   NOT NULL,
    label      VARCHAR(255) NULL,
    ice        VARCHAR(255) NULL,
    address    VARCHAR(255) NULL,
    email      VARCHAR(255) NULL,
    name       VARCHAR(255) NULL,
    sector     VARCHAR(255) NULL,
    is_deleted BIT(1) NOT NULL,
    CONSTRAINT pk_client PRIMARY KEY (client_id)
);

CREATE TABLE factory
(
    factory_id BINARY(16)   NOT NULL,
    label      VARCHAR(255) NOT NULL,
    city       VARCHAR(255) NULL,
    address    VARCHAR(255) NULL,
    is_deleted BIT(1)       NOT NULL,
    CONSTRAINT pk_factory PRIMARY KEY (factory_id)
);

CREATE TABLE log
(
    id_log         BINARY(16)   NOT NULL,
    entity_id      BINARY(16)   NULL,
    timestamp      date NULL,
    ip_address     VARCHAR(255) NULL,
    action_type    VARCHAR(255) NULL,
    status         VARCHAR(255) NULL,
    user_agent     VARCHAR(255) NULL,
    entity_type    VARCHAR(255) NULL,
    action_details VARCHAR(255) NULL,
    user_user_id   BINARY(16)   NULL,
    CONSTRAINT pk_log PRIMARY KEY (id_log)
);

CREATE TABLE notification
(
    notification_id  BINARY(16)   NOT NULL,
    title            VARCHAR(255) NULL,
    `description`    VARCHAR(255) NULL,
    status           VARCHAR(255) NULL,
    is_read          BOOLEAN  NULL,
    created_at       DATETIME NULL,
    receiver_user_id BINARY(16)   NULL,
    CONSTRAINT pk_notification PRIMARY KEY (notification_id)
);

CREATE TABLE privilege
(
    privilege_id BIGINT NOT NULL AUTO_INCREMENT,
    authority    VARCHAR(255) NULL,
    CONSTRAINT pk_privilege PRIMARY KEY (privilege_id)
);

CREATE TABLE project
(
    project_id      BINARY(16)   NOT NULL,
    label           VARCHAR(255) NULL,
    titre           VARCHAR(255) NULL,
    status          VARCHAR(255) NULL,
    dead_line       date NULL,
    is_deleted      BIT(1) NOT NULL,
    owner_client_id BINARY(16)   NULL,
    CONSTRAINT pk_project PRIMARY KEY (project_id)
);

CREATE TABLE report
(
    report_id          BINARY(16)   NOT NULL,
    title              VARCHAR(255) NULL,
    reason             VARCHAR(255) NULL,
    type               VARCHAR(255) NULL,
    status             VARCHAR(255) NULL,
    `description`      VARCHAR(255) NULL,
    created_at         DATETIME NULL,
    updated_at         DATETIME NULL,
    created_by_user_id BINARY(16)   NULL,
    updated_by_user_id BINARY(16)   NULL,
    CONSTRAINT pk_report PRIMARY KEY (report_id)
);

CREATE TABLE `role`
(
    role_id   BIGINT NOT NULL AUTO_INCREMENT,
    authority VARCHAR(255) NULL,
    CONSTRAINT pk_role PRIMARY KEY (role_id)
);

CREATE TABLE role_privileges
(
    privileges_privilege_id BIGINT NOT NULL,
    roles_role_id           BIGINT NOT NULL
);

CREATE TABLE rotation
(
    rotation_id       BINARY(16)   NOT NULL,
    name              VARCHAR(255) NULL,
    start_date        date NULL,
    end_date          date NULL,
    rotation_sequence INT NOT NULL,
    CONSTRAINT pk_rotation PRIMARY KEY (rotation_id)
);

CREATE TABLE rotation_custom_dates
(
    rotation_rotation_id BINARY(16) NOT NULL,
    custom_date        date NULL,
    rotation_status VARCHAR(10)

);

CREATE TABLE sub_factory
(
    sub_factory_id      BINARY(16)   NOT NULL,
    capacity           INT    NOT NULL,
    label              VARCHAR(255) NULL,
    title              VARCHAR(255) NULL,
    is_deleted         BIT(1) NOT NULL,
    factory_factory_id BINARY(16)   NULL,
    CONSTRAINT pk_subfactory PRIMARY KEY (sub_factory_id)
);

CREATE TABLE user
(
    user_id                   BINARY(16)   NOT NULL,
    first_name                VARCHAR(255) NULL,
    last_name                 VARCHAR(255) NULL,
    email                     VARCHAR(255) NOT NULL,
    password                  VARCHAR(255) NULL,
    username                  VARCHAR(255) NULL,
    `reference`               BIGINT       NOT NULL,
    phone_number              VARCHAR(255) NULL,
    is_deleted                BIT(1)       NOT NULL,
    created_at                date NULL,
    updated_at                date NULL,
    sub_factory_sub_factory_id BINARY(16)   NULL,
    CONSTRAINT pk_user PRIMARY KEY (user_id)
);

CREATE TABLE user_roles
(
    roles_role_id BIGINT NOT NULL,
    users_user_id BINARY(16) NOT NULL
);

ALTER TABLE factory
    ADD CONSTRAINT uc_factory_label UNIQUE (label);

ALTER TABLE user
    ADD CONSTRAINT uc_user_email UNIQUE (email);

ALTER TABLE user
    ADD CONSTRAINT uc_user_reference UNIQUE (`reference`);

ALTER TABLE assigned_rotation
    ADD CONSTRAINT FK_ASSIGNEDROTATION_ON_CREATEDBY_USERID FOREIGN KEY (created_by_user_id) REFERENCES user (user_id);

ALTER TABLE assigned_rotation
    ADD CONSTRAINT FK_ASSIGNEDROTATION_ON_PROJECT_PROJECTID FOREIGN KEY (project_project_id) REFERENCES project (project_id);

ALTER TABLE assigned_rotation
    ADD CONSTRAINT FK_ASSIGNEDROTATION_ON_ROTATION_ROTATIONID FOREIGN KEY (rotation_rotation_id) REFERENCES rotation (rotation_id);

ALTER TABLE assigned_rotation
    ADD CONSTRAINT FK_ASSIGNEDROTATION_ON_UPDATEDBY_USERID FOREIGN KEY (updated_by_user_id) REFERENCES user (user_id);

ALTER TABLE assigned_rotation
    ADD CONSTRAINT FK_ASSIGNEDROTATION_ON_USER_USERID FOREIGN KEY (user_user_id) REFERENCES user (user_id);

ALTER TABLE log
    ADD CONSTRAINT FK_LOG_ON_USER_USERID FOREIGN KEY (user_user_id) REFERENCES user (user_id);

ALTER TABLE notification
    ADD CONSTRAINT FK_NOTIFICATION_ON_RECEIVER_USERID FOREIGN KEY (receiver_user_id) REFERENCES user (user_id);

ALTER TABLE project
    ADD CONSTRAINT FK_PROJECT_ON_OWNER_CLIENTID FOREIGN KEY (owner_client_id) REFERENCES client (client_id);

ALTER TABLE report
    ADD CONSTRAINT FK_REPORT_ON_CREATEDBY_USERID FOREIGN KEY (created_by_user_id) REFERENCES user (user_id);

ALTER TABLE report
    ADD CONSTRAINT FK_REPORT_ON_UPDATEDBY_USERID FOREIGN KEY (updated_by_user_id) REFERENCES user (user_id);

ALTER TABLE sub_factory
    ADD CONSTRAINT FK_SUBFACTORY_ON_FACTORY_FACTORYID FOREIGN KEY (factory_factory_id) REFERENCES factory (factory_id);

ALTER TABLE user
    ADD CONSTRAINT FK_USER_ON_SUBFACTORY_SUBFACTORYID FOREIGN KEY (sub_factory_sub_factory_id) REFERENCES sub_factory (sub_factory_id);

ALTER TABLE role_privileges
    ADD CONSTRAINT fk_rolpri_on_privilege FOREIGN KEY (privileges_privilege_id) REFERENCES privilege (privilege_id);

ALTER TABLE role_privileges
    ADD CONSTRAINT fk_rolpri_on_role FOREIGN KEY (roles_role_id) REFERENCES `role` (role_id);

ALTER TABLE rotation_custom_dates
    ADD CONSTRAINT fk_rotation_customdates_on_rotation FOREIGN KEY (rotation_rotation_id) REFERENCES rotation (rotation_id);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_userol_on_role FOREIGN KEY (roles_role_id) REFERENCES `role` (role_id);

ALTER TABLE user_roles
    ADD CONSTRAINT fk_userol_on_user FOREIGN KEY (users_user_id) REFERENCES user (user_id);