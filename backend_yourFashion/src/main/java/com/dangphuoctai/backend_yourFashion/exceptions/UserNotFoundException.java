package com.dangphuoctai.backend_yourFashion.exceptions;

public class UserNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;

    public UserNotFoundException() {
    }

    public UserNotFoundException(String message) {
        super(message);

    }
}
