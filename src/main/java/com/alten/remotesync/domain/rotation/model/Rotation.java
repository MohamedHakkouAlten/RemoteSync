package com.alten.remotesync.domain.rotation.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Rotation {
    @Id
    @UuidGenerator
    private UUID rotationId;
    private String name;
    private Date startDate;
    private Date endDate;

    @ElementCollection
    private List<Date> customDates;
    private int rotationSequence;

    @OneToMany(mappedBy = "rotation")
    private List<AssignedRotation> rotationAssignedRotations;
}
