package com.bookadmin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String name;
    private String author;
    private String description;
    private LocalDateTime createdAt;
    private Integer publishAt;
    private String bookNo;
    private String cover;
    private Integer stock;
    private String category;
    private Long categoryId;
}






