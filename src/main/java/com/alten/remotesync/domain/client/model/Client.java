package com.alten.remotesync.domain.client.model;

import com.alten.remotesync.domain.project.model.Project;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

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

    @OneToMany(mappedBy = "owner")@JsonBackReference
    private List<Project> clientProjects;
}
