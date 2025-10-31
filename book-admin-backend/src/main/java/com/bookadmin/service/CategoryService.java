package com.bookadmin.service;

import com.bookadmin.dto.CategoryDTO;
import com.bookadmin.entity.Category;
import com.bookadmin.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getCategories(Integer level, Boolean all) {
        List<Category> categories;
        
        if (Boolean.TRUE.equals(all)) {
            categories = categoryRepository.findAll();
        } else if (level != null) {
            categories = categoryRepository.findByLevel(level);
        } else {
            categories = categoryRepository.findRootCategories();
        }
        
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDTO(category);
    }
    
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = convertToEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        existingCategory.setName(categoryDTO.getName());
        existingCategory.setLevel(categoryDTO.getLevel());
        existingCategory.setParentLevel(categoryDTO.getParentLevel());
        
        if (categoryDTO.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            existingCategory.setParent(parent);
        }
        
        Category savedCategory = categoryRepository.save(existingCategory);
        return convertToDTO(savedCategory);
    }
    
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setLevel(category.getLevel());
        dto.setParentLevel(category.getParentLevel());
        
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }
        
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            dto.setChildren(category.getChildren().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setLevel(dto.getLevel());
        category.setParentLevel(dto.getParentLevel());
        
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }
        
        return category;
    }
}








