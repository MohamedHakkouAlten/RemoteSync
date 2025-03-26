package com.alten.remotesync.domain.subFactory.model;

import com.alten.remotesync.domain.factory.model.Factory;
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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubFactory {
    @Id
    @UuidGenerator
    private UUID subFactoryID ;
    private int capacity;
    private String label;
    private String title;

    private boolean isDeleted;

    @ManyToOne
    private Factory factory;

    @OneToMany(mappedBy = "subFactory")
    private List<User> subFactoryUsers;
}
