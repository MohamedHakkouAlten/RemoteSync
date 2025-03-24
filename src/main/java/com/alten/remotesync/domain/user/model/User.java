package com.alten.remotesync.domain.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private UUID id;

        private String firstName;
        private String lastName;

        @Column(unique = true, nullable = false)
        private String email;

        private String password;
        private String username;
        private Long reference;
        private String phoneNumber;

        private boolean isDeleted;

        @Temporal(TemporalType.TIMESTAMP)
        private Date createdAt;

        @Temporal(TemporalType.TIMESTAMP)
        private Date updatedAt;

        @ManyToOne
        @JoinColumn(name = "created_by")
        private User createdBy;

        @ManyToOne
        @JoinColumn(name = "updated_by")
        private User updatedBy;
}