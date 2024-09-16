package com.dangphuoctai.backend_yourFashion.payloads;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {

    private Long cartId;
    private String email;
    private Double totalPrice = 0.0;
    // private List<ProductDTO> products = new ArrayList<>();
    private List<CartItemDTO> cartItems = new ArrayList<>();

}