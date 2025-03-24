package com.alten.remotesync.domain.user.model;

import java.util.Date;
import java.util.UUID;

public class User {

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
        private org.apache.catalina.User createdBy;
        private org.apache.catalina.User updatedBy;
}
