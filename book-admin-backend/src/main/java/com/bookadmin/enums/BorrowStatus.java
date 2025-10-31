package com.bookadmin.enums;

public enum BorrowStatus {
    ON("on"),
    OFF("off");

    private final String value;

    BorrowStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

