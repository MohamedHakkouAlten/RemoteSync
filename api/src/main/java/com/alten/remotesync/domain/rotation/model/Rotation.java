package com.alten.remotesync.domain.rotation.model;

import com.alten.remotesync.domain.assignedRotation.model.AssignedRotation;
import com.alten.remotesync.domain.customDate.model.CustomDate;
import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.*;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "rotation_custom_dates",
            joinColumns = @JoinColumn(name = "rotation_rotation_id")
    )

    public List<CustomDate> customDates;
    private int shift;

    private int cycle ;


}
