package com.alten.remotesync.kernel.utilty.RolePrivileges;

import lombok.RequiredArgsConstructor;

import java.util.Set;

import static com.alten.remotesync.kernel.utilty.RolePrivileges.DefaultRolePrivileges.*;

@RequiredArgsConstructor
public enum DefaultRoles {
    ROLE_ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_WRITE,
                    ADMIN_DELETE
            )
    ),
    ROLE_USER(
            Set.of(
                    USER_READ,
                    USER_WRITE,
                    USER_DELETE
            )
    );

    public final Set<DefaultRolePrivileges> defaultRolePrivileges;
}
