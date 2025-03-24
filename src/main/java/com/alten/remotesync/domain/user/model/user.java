package com.alten.remotesync.domain.user.model;

import org.apache.catalina.User;

import java.util.Date;
import java.util.UUID;

public class user {

        private UUID id;
        private String nom;
        private String prenom;
        private String email;
        private String password;
        private String username;
        private Long matricule;
        private String phoneNumber;
        private boolean isDeleted;
        private Date createdAt;
        private Date updatedAt;
        private User createdBy;
        private User updatedBy;
}
