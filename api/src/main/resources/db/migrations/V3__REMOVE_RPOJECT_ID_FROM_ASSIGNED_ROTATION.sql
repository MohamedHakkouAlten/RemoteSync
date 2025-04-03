DROP TABLE assigned_rotation;

CREATE TABLE assigned_rotation
(
    rotation_assignment_status VARCHAR(255) NULL,
    override_date              datetime NULL,
    created_at                 datetime NULL,
    updated_at                 datetime NULL,
    created_by_user_id         BINARY(16)   NULL,
    updated_by_user_id         BINARY(16)   NULL,
    user_user_id               BINARY(16)   NOT NULL,
    rotation_rotation_id       BINARY(16)   NOT NULL,
    project_project_id         BINARY(16)   NULL,
    CONSTRAINT pk_assignedrotation PRIMARY KEY (user_user_id, rotation_rotation_id)
);

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