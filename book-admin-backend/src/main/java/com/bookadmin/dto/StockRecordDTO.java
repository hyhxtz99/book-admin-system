package com.bookadmin.dto;

import com.bookadmin.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockRecordDTO {
    private Long id;
    private BookDTO book;
    private UserDTO admin;
    private Integer stockQuantity;
    private String signatureImage;
    private String remarks;
    private LocalDateTime createdAt;
}


