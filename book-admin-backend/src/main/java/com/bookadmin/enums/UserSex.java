package com.bookadmin.enums;

public enum UserSex {
    MALE("male"),
    FEMALE("female");

    private final String value;

    UserSex(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

