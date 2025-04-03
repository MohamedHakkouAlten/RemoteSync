package com.alten.remotesync.domain.factory.model;

import com.alten.remotesync.domain.subFactory.model.SubFactory;
import jakarta.persistence.*;
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
public class Factory {
    @Id
    @UuidGenerator
    private UUID factoryId;

    @Column(unique = true ,nullable = false)
    private String label;

    private String City;

    private String address;

    private boolean isDeleted;

    @OneToMany(mappedBy = "factory")
    private List<SubFactory> subFactoryList;
}
