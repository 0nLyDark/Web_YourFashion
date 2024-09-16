package com.dangphuoctai.backend_yourFashion.service;

import com.dangphuoctai.backend_yourFashion.entity.Category;
import com.dangphuoctai.backend_yourFashion.payloads.CategoryDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CategoryResponse;

public interface CategoryService {

    CategoryDTO createCategory(Category category);

    CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String type);

    CategoryDTO getCategoryById(Long categoryId);

    CategoryDTO updateCategory(Category category, Long categoryId);

    String deleteCategory(Long categoryId);

}
