package com.alten.remotesync.domain.rotation.enumeration;


import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum RotationStatus {
    ONSITE("on-site"),
    REMOTE("remote");
    public final String value;

    @JsonValue
    String getValue(){
        return value;
    }
}
