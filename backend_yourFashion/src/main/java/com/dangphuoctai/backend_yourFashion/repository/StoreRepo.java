package com.dangphuoctai.backend_yourFashion.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Store;

@Repository
public interface StoreRepo extends JpaRepository<Store, Long> {

    Optional<Store> findByEmail(String email);

}
