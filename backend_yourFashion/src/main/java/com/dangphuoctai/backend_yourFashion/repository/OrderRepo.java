package com.dangphuoctai.backend_yourFashion.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.email = ?1 AND o.id = ?2")
    Order findOrderByEmailAndOrderId(String email, Long cartId);

    Page<Order> findAllByEmail(String emailId, Pageable pageable);

    Page<Order> findAllByStoreEmail(String emailId, Pageable pageable);

    Page<Order> findAllByStoreStoreId(Long storeId, Pageable pageable);

    List<Order> findAllByEmail(String emailId);
}