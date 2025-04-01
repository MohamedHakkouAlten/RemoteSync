package com.alten.remotesync.adapter.exception.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) { super(message); }
}
