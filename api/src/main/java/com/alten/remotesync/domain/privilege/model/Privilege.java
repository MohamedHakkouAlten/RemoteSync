package com.alten.remotesync.domain.privilege.model;

import com.alten.remotesync.domain.role.model.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Privilege implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long privilegeId;

    private String authority;

    @ManyToMany(mappedBy = "privileges") @JsonIgnore
    private List<Role> roles;
}
