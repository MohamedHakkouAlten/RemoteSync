package com.alten.remotesync.domain.client.model;

import com.alten.remotesync.domain.project.model.Project;
import com.alten.remotesync.domain.user.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Client {
    @Id
    @UuidGenerator
    private UUID clientId;
    private String label;
    private String ICE;
    private String address;
    private String email;
    private String name;
    private String sector;
    private boolean isDeleted;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private User updatedBy;

    @OneToMany(mappedBy = "owner")
    private List<Project> clientProjects;
}
