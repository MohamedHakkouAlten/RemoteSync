package com.alten.remotesync.domain.rotation.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.assignedRotation.model.embeddable.AssignedRotationId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.List;
import java.util.UUID;
@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Rotation {
    @Id
    @UuidGenerator
    private UUID rotationId;
    private String name;
    private Date startDate;
    private Date endDate;
    private List<Date> customDates;
    private int rotationSequence;

    @OneToMany(mappedBy = "assignedRotationId.rotation")
    private List<AssignedRotation> rotationAssignedRotations;
}
