package com.dangphuoctai.backend_yourFashion.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.payloads.ProductDTO;
import com.dangphuoctai.backend_yourFashion.payloads.ProductResponse;

public interface ProductService {
        ProductDTO addProduct(Long categoryId, String email, Product product);

        ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                        Boolean sale);

        ProductResponse getProductByStore(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                        Boolean sale, Long storeId);

        ProductResponse getProductsByStoreAndStoreCategory(Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder,
                        Boolean sale, Long storeId, Long categoryId);

        ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder, Boolean sale);

        ProductDTO updateProduct(Long productId, Product product, String email);

        ProductDTO updateProductImage(Long productId, MultipartFile image, String email) throws IOException;

        public InputStream getProductImage(String fileName) throws FileNotFoundException;

        ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
                        String sortBy,

                        String sortOrder, Boolean sale);

        String deleteProduct(Long productId, String email);

        String deleteProduct(Long productId);

        ProductDTO getProductById(Long productId);

}