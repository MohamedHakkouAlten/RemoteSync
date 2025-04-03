package com.alten.remotesync.domain.assignedRotation.model.embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AssignedRotationId {
    private UUID userId;

    private UUID rotationId;
}