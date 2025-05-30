package com.alten.remotesync.domain.customDate.model;

import com.alten.remotesync.domain.rotation.enumeration.RotationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomDate {

    @Column(name = "custom_date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "rotation_status")
    private RotationStatus rotationStatus;
}