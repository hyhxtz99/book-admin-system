package com.bookadmin.enums;

public enum UserStatus {
    ON("on"),
    OFF("off");

    private final String value;

    UserStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

