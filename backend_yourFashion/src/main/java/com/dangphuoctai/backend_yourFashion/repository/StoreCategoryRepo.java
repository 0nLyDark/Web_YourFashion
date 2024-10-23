package com.dangphuoctai.backend_yourFashion.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.StoreCategory;

@Repository
public interface StoreCategoryRepo extends JpaRepository<StoreCategory, Long> {

    @Query("SELECT sc.id FROM StoreCategory sc WHERE sc.store.email = ?1 AND sc.categoryName = ?2")
    StoreCategory findByStoreEmailAndCategoryName(String email, String categoryName);

    @Query("SELECT sc FROM StoreCategory sc WHERE sc.store.email = ?1 AND sc.id = ?2")
    StoreCategory findStoreCategoryByEmailAndCategoryId(String email, Long categoryId);

    @Query("SELECT sc FROM StoreCategory sc WHERE sc.store.id =?1")
    Page<StoreCategory> findStoreCategoryByStoreId(Long storeId, Pageable pageable);
}