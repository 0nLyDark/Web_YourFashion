package com.dangphuoctai.backend_yourFashion.service;

import java.util.List;

import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryResponse;

public interface StoreCategoryService {

        StoreCategoryDTO createCategory(String email, StoreCategoryDTO storeCategoryDTO);

        StoreCategoryResponse getAllCategory(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                        Long storeId);

        StoreCategoryResponse getCatgoryByStoreId(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                        Long storeId);

        StoreCategoryDTO getCatgoryById(Long categoryId);

        StoreCategoryDTO addProductToCategory(String email, Long categoryId, List<Long> productIds);

        StoreCategoryDTO removeProductToStoreCategory(String email, Long categoryId, List<Long> productIds);

        StoreCategoryDTO addProductToCategory(String email, Long categoryId, Long productId);

        StoreCategoryDTO removeProductToStoreCategory(String email, Long categoryId, Long productId);

        StoreCategoryDTO updateCategory(String email, Long categoryId, StoreCategoryDTO storeCategoryDTO);

        String deleteCategory(Long categoryId, String email);

}
