package com.alten.remotesync.kernel.utilty.RolePrivileges;

import lombok.RequiredArgsConstructor;

import java.util.Set;

import static com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRolePrivileges.*;

@RequiredArgsConstructor
public enum DefaultRoles {
    ROLE_ADMIN(
            Set.of(
                    UPDATE_PROFILE,

                    RC_READ,
                    RC_READ_REQUEST,
                    RC_WRITE_ROTATION,
                    RC_UPDATE_ROTATION,
                    RC_UPDATE_REQUEST,

                    ADMIN_READ_LOGS,
                    ADMIN_READ_PROJECT,
                    ADMIN_READ_USER,
                    ADMIN_READ_CLIENT,
                    ADMIN_READ_FACTORY,
                    ADMIN_READ_SUB_FACTORY,

                    ADMIN_WRITE_PROJECT,
                    ADMIN_WRITE_USER,
                    ADMIN_WRITE_CLIENT,
                    ADMIN_WRITE_FACTORY,
                    ADMIN_WRITE_SUB_FACTORY,

                    ADMIN_UPDATE_PROJECT,
                    ADMIN_UPDATE_USER,
                    ADMIN_UPDATE_CLIENT,
                    ADMIN_UPDATE_FACTORY,
                    ADMIN_UPDATE_SUB_FACTORY
            )
    ),
    ROLE_ASSOCIATE(
            Set.of(
                    UPDATE_PROFILE,

                    ASSOCIATE_READ,
                    ASSOCIATE_REQUEST
            )
    ),
    ROLE_RC(
            Set.of(
                    UPDATE_PROFILE,

                    RC_READ,
                    RC_READ_REQUEST,
                    RC_WRITE_ROTATION,
                    RC_UPDATE_ROTATION,
                    RC_UPDATE_REQUEST
            )
    );


    public final Set<DefaultRolePrivileges> defaultRolePrivileges;
}
