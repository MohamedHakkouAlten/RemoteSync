package com.alten.remotesync.domain.role.model;

import com.alten.remotesync.domain.privilege.model.Privilege;
import com.alten.remotesync.domain.user.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long roleId;
    
    private String authority;
    
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Privilege> privileges;
    
    @ManyToMany(mappedBy = "roles") @JsonIgnore
    private List<User> users;
}
