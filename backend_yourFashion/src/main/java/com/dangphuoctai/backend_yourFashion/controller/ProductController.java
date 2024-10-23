package com.dangphuoctai.backend_yourFashion.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.payloads.ProductDTO;
import com.dangphuoctai.backend_yourFashion.payloads.ProductResponse;
import com.dangphuoctai.backend_yourFashion.service.ProductService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/seller/categories/{categoryId}/stores/email/{email}/products")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody Product product, @Valid @PathVariable String email,
            @Valid @PathVariable Long categoryId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        // Chỉ cho phép người dùng truy cập thông tin của họ
        if (!email.equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        ProductDTO savedProduct = productService.addProduct(categoryId, email, product);

        return new ResponseEntity<ProductDTO>(savedProduct, HttpStatus.CREATED);

    }

    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ProductDTO> getOneCategory(@PathVariable Long productId) {
        ProductDTO ProductDTO = productService.getProductById(productId);

        return new ResponseEntity<>(ProductDTO, HttpStatus.OK);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "sale", defaultValue = "false", required = false) Boolean sale) {

        ProductResponse productResponse = productService.getAllProducts(
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder, sale);

        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/stores/{storeId}/products")
    public ResponseEntity<ProductResponse> getProductsByStore(@PathVariable Long storeId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "sale", defaultValue = "false", required = false) Boolean sale) {

        ProductResponse productResponse = productService.getProductByStore(
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder, sale, storeId);

        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/stores/{storeId}/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByStoreAndStoreCategory(@PathVariable Long storeId,
            @PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "sale", defaultValue = "false", required = false) Boolean sale) {

        ProductResponse productResponse = productService.getProductsByStoreAndStoreCategory(
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder, sale, storeId, categoryId);

        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(@PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "sale", defaultValue = "false", required = false) Boolean sale) {

        ProductResponse productResponse = productService.searchByCategory(
                categoryId,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder, sale);

        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);

    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "sale", defaultValue = "false", required = false) Boolean sale,
            @RequestParam(name = "categoryId", defaultValue = "0", required = false) Long categoryId) {

        ProductResponse productResponse = productService.searchProductByKeyword(
                keyword,
                categoryId,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder, sale);
        return new ResponseEntity<ProductResponse>(productResponse, HttpStatus.OK);

    }

    @GetMapping("/public/products/image/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = productService.getProductImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);

        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    @PutMapping("/seller/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody Product product,
            @PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

        ProductDTO updatedProduct = productService.updateProduct(productId, product, isAdmin ? null : currentEmail);
        return new ResponseEntity<ProductDTO>(updatedProduct, HttpStatus.OK);

    }

    @PutMapping("/seller/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId,
            @RequestParam("image") MultipartFile image) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

        ProductDTO updatedProduct = productService.updateProductImage(productId, image, isAdmin ? null : currentEmail);

        return new ResponseEntity<ProductDTO>(updatedProduct, HttpStatus.OK);

    }

    @DeleteMapping("/seller/products/{productId}")
    public ResponseEntity<String> deleteProductByStore(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
        String status = productService.deleteProduct(productId, isAdmin ? null : currentEmail);

        return new ResponseEntity<String>(status, HttpStatus.OK);

    }

}