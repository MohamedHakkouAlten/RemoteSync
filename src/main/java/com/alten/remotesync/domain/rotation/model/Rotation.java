package com.alten.remotesync.domain.rotation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
}
