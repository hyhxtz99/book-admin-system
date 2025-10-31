package com.bookadmin.dto;

import com.bookadmin.enums.BorrowStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDTO {
    private Long id;
    private BookDTO book;
    private UserDTO user;
    private BorrowStatus status;
    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;
}






