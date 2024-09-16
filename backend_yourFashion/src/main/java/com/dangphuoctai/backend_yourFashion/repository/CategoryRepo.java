package com.dangphuoctai.backend_yourFashion.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    Category findByCategoryName(String categoryName);
    Page<Category> findByCategoryParentNull(Pageable pageable);


}
