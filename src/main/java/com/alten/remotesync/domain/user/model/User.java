package com.alten.remotesync.domain.user.model;

import com.alten.remotesync.domain.role.model.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
        @Id
        @UuidGenerator
        private UUID userId;

        private String firstName;
        private String lastName;

        @Column(unique = true, nullable = false)
        private String email;

        private String password;
        private String username;

        @Column(unique = true, nullable = false)
        private Long reference;

        private String phoneNumber;

        @ManyToMany(fetch = FetchType.LAZY)
        protected List<Role> roles;

        private boolean isDeleted;

        @CreationTimestamp
        private LocalDateTime createdAt;

        @UpdateTimestamp
        private LocalDateTime updatedAt;

        @ManyToOne
        private User createdBy;

        @ManyToOne
        private User updatedBy;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                Set<GrantedAuthority> authorities = new HashSet<>(roles);
                for (Role role : roles) {
                        authorities.addAll(role.getPrivileges());
                }
                return authorities;
        }
}