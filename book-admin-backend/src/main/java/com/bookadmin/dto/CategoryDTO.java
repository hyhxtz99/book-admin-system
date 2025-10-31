package com.bookadmin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private Integer level;
    private String parentLevel;
    private Long parentId;
    private String parentName;
    private List<CategoryDTO> children;
}






