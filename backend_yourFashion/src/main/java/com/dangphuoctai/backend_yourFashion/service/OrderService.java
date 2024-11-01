package com.dangphuoctai.backend_yourFashion.service;

import java.util.List;

import com.dangphuoctai.backend_yourFashion.payloads.OrderDTO;
import com.dangphuoctai.backend_yourFashion.payloads.OrderResponse;

public interface OrderService {

        OrderDTO placeOrder(String emailId, Long cartId, String paymentMethod, OrderDTO orderDTO);

        String placeOrder(String emailId, Long cartId, String paymentMethod, OrderDTO orderDTO, List<Long> productIds);

        OrderDTO getOrder(String emailId, Long orderId, String emailCheck);

        List<OrderDTO> getOrdersByUser(String emailId, Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder);

        OrderResponse getAllOrdersByStoreId(Long storeId, String emailCheck, Integer pageNumber, Integer pageSize,
                        String sortBy,
                        String sortOrder);

        OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

        OrderDTO updateOrder(String emailId, Long orderId, String orderStatus, String emailCheck);

}
