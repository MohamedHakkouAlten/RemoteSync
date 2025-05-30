package com.alten.remotesync.domain.rotation.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.ArrayList;
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
    private LocalDate startDate;
    private LocalDate endDate;

    // Rotation Pattern:
    // Every X weeks, Y weeks are remote
    private int cycleLengthWeeks;          // Total weeks in a rotation cycle (e.g. 3)  # CYCLE
    private int remoteWeeksPerCycle;       // Number of remote weeks in the cycle (e.g. 2)  # SHIFT
    // Example: cycleLengthWeeks = 3, remoteWeeksPerCycle = 2
    // Means: Every 3 weeks, 2 are remote, 1 is on-site

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "rotation_custom_dates",
            joinColumns = @JoinColumn(name = "rotation_rotation_id")
    )
    public List<CustomDate> customDates = new ArrayList<>();

    @OneToMany(mappedBy = "rotation") @JsonBackReference
    private List<AssignedRotation> rotationAssignedRotations;
}
