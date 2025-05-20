package com.alten.remotesync.adapter.exception.assignedRotation;

public class CapacityExceededException extends RuntimeException{
    private static final String CAPACITY_EXCEEDED="Capacity exceeded for date : ";
    public CapacityExceededException(String message) {super(CAPACITY_EXCEEDED+message);}
}
