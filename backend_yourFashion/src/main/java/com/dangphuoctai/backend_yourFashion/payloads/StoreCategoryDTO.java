package com.dangphuoctai.backend_yourFashion.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreCategoryDTO {
    private Long categoryId;

    private String categoryName;

    private StoreDTO store;

    private boolean status;
}
