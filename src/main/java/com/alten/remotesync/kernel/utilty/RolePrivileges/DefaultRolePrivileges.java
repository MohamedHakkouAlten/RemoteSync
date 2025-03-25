package com.alten.remotesync.kernel.utilty.RolePrivileges;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DefaultRolePrivileges {
    ADMIN_READ("ADMIN:READ"),
    ADMIN_WRITE("ADMIN:WRITE"),
    ADMIN_DELETE("ADMIN:DELETE"),
    ADMIN_UPDATE("ADMIN:UPDATE"),

    USER_READ("USER:READ"),
    USER_WRITE("USER:WRITE"),
    USER_DELETE("USER:DELETE"),
    ;

    public final String authority;
}
