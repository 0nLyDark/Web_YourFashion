package com.dangphuoctai.backend_yourFashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

}