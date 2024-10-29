package com.dangphuoctai.backend_yourFashion.payloads;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private OrderDTO orderDTO;
    private List<Long> productIds;
}
