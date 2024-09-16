package com.dangphuoctai.backend_yourFashion.payloads;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {

    private Long categoryId;
    private String categoryName;
    private CategoryDTOChildren categoryParent;
    private List<CategoryDTOChildren> categoryChildren = new ArrayList<>();

    // private List<ProductDTO> products = new ArrayList<>();

}