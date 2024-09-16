package com.dangphuoctai.backend_yourFashion.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Product;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    Page<Product> findByProductNameLike(String keyword, Pageable pageDetails);
    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByDiscountNot(int discount, Pageable pageable);
    Page<Product> findByCategoryCategoryIdIn(List<Long> categoryIds, Pageable pageable);
}
