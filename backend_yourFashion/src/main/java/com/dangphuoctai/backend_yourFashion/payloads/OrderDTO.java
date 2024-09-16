package com.dangphuoctai.backend_yourFashion.payloads;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long orderId;
    private String email;
    private String deliveryName;
    private String deliveryPhone;
    private AddressDTO address;
    private List<OrderItemDTO> orderItems = new ArrayList<>();
    private LocalDate orderDate;
    private PaymentDTO payment;
    private Double totalAmount;
    private String orderStatus;

}