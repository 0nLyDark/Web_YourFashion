package com.dangphuoctai.backend_yourFashion.service;

import java.util.List;

import com.dangphuoctai.backend_yourFashion.payloads.OrderDTO;
import com.dangphuoctai.backend_yourFashion.payloads.OrderResponse;

public interface OrderService {

    OrderDTO placeOrder(String emailId, Long cartId, String paymentMethod,OrderDTO orderDTO);

    OrderDTO getOrder(String emailId, Long orderId);

    List<OrderDTO> getOrdersByUser(String emailId);

    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderDTO updateOrder(String emailId, Long orderId, String orderStatus);

}
