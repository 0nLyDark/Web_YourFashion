package com.dangphuoctai.backend_yourFashion.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Product;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    
    Page<Product> findByProductNameLike(String keyword, Pageable pageDetails);

    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByDiscountNot(int discount, Pageable pageable);

    Page<Product> findByCategoryCategoryIdIn(List<Long> categoryIds, Pageable pageable);

    Page<Product> findByDiscountNotAndCategoryCategoryIdIn(int discount, List<Long> categoryIds, Pageable pageable);

    Page<Product> findByStoreStoreId(Long storeId, Pageable pageable);

    Page<Product> findByDiscountNotAndStoreStoreId(int discount, Long storeId, Pageable pageable);

    Page<Product> findByDiscountNotAndProductNameLike(int discount, String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN FETCH p.storeCategories sc WHERE sc.categoryId = ?1")
    Page<Product> findByStoreCategoryCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.store.email = ?1 AND p.id IN ?2 ")
    List<Product> findAllByStoreEmailAndProductIds(String email, List<Long> productIds);

    @Query("SELECT p FROM Product p WHERE p.id = ?1 AND p.store.email =?2 ")
    Optional<Product> findByIdAndStoreEmail(Long productId, String email);

    @Query("SELECT p FROM Product p WHERE p.id = ?1 AND p.store.id =?2 ")
    Optional<Product> findByIdAndStoreId(Long productId, Long storeId);
}
