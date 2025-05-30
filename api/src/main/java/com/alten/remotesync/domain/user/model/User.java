package com.alten.remotesync.domain.user.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.log.model.Log;
import com.alten.remotesync.domain.notification.model.Notification;
import com.alten.remotesync.domain.report.model.Report;
import com.alten.remotesync.domain.role.model.Role;
import com.alten.remotesync.domain.subFactory.model.SubFactory;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

        @JsonIgnore
        private String password;
        @Column(unique = true,nullable = false)
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

        
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Log> logs;

        @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Notification> notifications;

        
        @OneToMany(mappedBy = "createdBy")
        private List<Report> createdReports;

        
        @OneToMany(mappedBy = "updatedBy")
        private List<Report> updatedReports;

        
        @OneToMany(mappedBy = "user") @JsonBackReference
        private List<AssignedRotation> userAssignedRotations;

        @ManyToOne
        private SubFactory subFactory;


        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                return new HashSet<>(roles);
        }
}