package com.bookadmin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    private List<T> data;
    private Long total;
    private Integer current;
    private Integer pageSize;
    private Integer totalPages;
}






