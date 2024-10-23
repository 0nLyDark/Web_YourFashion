package com.dangphuoctai.backend_yourFashion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryResponse;
import com.dangphuoctai.backend_yourFashion.service.StoreCategoryService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class StoreCategoryController {

        @Autowired
        private StoreCategoryService storeCategoryService;

        @PostMapping("/seller/stores/email/{email}/categories")
        public ResponseEntity<StoreCategoryDTO> createStoreCategory(@RequestBody StoreCategoryDTO storeCategoryDTO,
                        @PathVariable String email) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
                if (!isAdmin && !email.equals(currentEmail)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }

                StoreCategoryDTO storeCategory = storeCategoryService.createCategory(email, storeCategoryDTO);

                return new ResponseEntity<StoreCategoryDTO>(storeCategory, HttpStatus.OK);

        }

        @GetMapping("public/stores/categories")
        public ResponseEntity<StoreCategoryResponse> getAllCategoryStore(
                        @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                        @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                        @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORIES_BY, required = false) String sortBy,
                        @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
                        @Valid @PathVariable Long storeId) {

                StoreCategoryResponse categoryResponse = storeCategoryService.getAllCategory(
                                pageNumber == 0 ? pageNumber : pageNumber - 1,
                                pageSize,
                                "id".equals(sortBy) ? "categoryId" : sortBy,
                                sortOrder, storeId);

                return new ResponseEntity<StoreCategoryResponse>(categoryResponse, HttpStatus.OK);
        }

        @GetMapping("public/stores/{storeId}/categories")
        public ResponseEntity<StoreCategoryResponse> getAllCategoryByStore(@Valid @PathVariable Long storeId,
                        @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                        @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                        @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CATEGORIES_BY, required = false) String sortBy,
                        @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

                StoreCategoryResponse categoryResponse = storeCategoryService.getCatgoryByStoreId(
                                pageNumber == 0 ? pageNumber : pageNumber - 1,
                                pageSize,
                                "id".equals(sortBy) ? "categoryId" : sortBy,
                                sortOrder, storeId);

                return new ResponseEntity<StoreCategoryResponse>(categoryResponse, HttpStatus.OK);
        }

        @GetMapping("public/stores/categories/{categoryId}")
        public ResponseEntity<StoreCategoryDTO> getCategoryByStore(
                        @Valid @PathVariable Long categoryId) {

                StoreCategoryDTO storeCategoryDTO = storeCategoryService.getCatgoryById(categoryId);

                return new ResponseEntity<StoreCategoryDTO>(storeCategoryDTO, HttpStatus.OK);
        }

        @PutMapping("seller/stores/categories/{categoryId}")
        public ResponseEntity<StoreCategoryDTO> updateStoreCategory(@PathVariable Long categoryId,
                        @RequestBody StoreCategoryDTO storeCategoryDTO) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                StoreCategoryDTO savedStoreCategory = storeCategoryService.updateCategory(isAdmin ? null : currentEmail,
                                categoryId, storeCategoryDTO);

                return new ResponseEntity<StoreCategoryDTO>(savedStoreCategory, HttpStatus.OK);
        }

        @PostMapping("seller/stores/categories/{categoryId}/products/{productId}")
        public ResponseEntity<StoreCategoryDTO> addProductIdToStoreCategory(@PathVariable Long categoryId,
                        @PathVariable Long productId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));
                StoreCategoryDTO savedStoreCategory = storeCategoryService.addProductToCategory(
                                isAdmin ? null : currentEmail, categoryId,
                                productId);

                return new ResponseEntity<StoreCategoryDTO>(savedStoreCategory,
                                HttpStatus.OK);
        }

        @DeleteMapping("seller/stores/categories/{categoryId}/products/{productId}")
        public ResponseEntity<StoreCategoryDTO> removeProductIdToStoreCategory(@PathVariable Long categoryId,
                        @PathVariable Long productId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                StoreCategoryDTO savedStoreCategory = storeCategoryService.removeProductToStoreCategory(
                                isAdmin ? null : currentEmail,
                                categoryId, productId);

                return new ResponseEntity<StoreCategoryDTO>(savedStoreCategory,
                                HttpStatus.OK);
        }

        @PostMapping("seller/stores/categories/{categoryId}/products")
        public ResponseEntity<StoreCategoryDTO> addProductToStoreCategory(@PathVariable Long categoryId,
                        @RequestBody List<Long> productIds) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                StoreCategoryDTO savedStoreCategory = storeCategoryService.addProductToCategory(
                                isAdmin ? null : currentEmail, categoryId,
                                productIds);

                return new ResponseEntity<StoreCategoryDTO>(savedStoreCategory,
                                HttpStatus.OK);
        }

        @DeleteMapping("seller/stores/categories/{categoryId}/products")
        public ResponseEntity<StoreCategoryDTO> removeProductToStoreCategory(@PathVariable Long categoryId,
                        @RequestBody List<Long> productIds) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                StoreCategoryDTO savedStoreCategory = storeCategoryService.removeProductToStoreCategory(
                                isAdmin ? null : currentEmail,
                                categoryId,
                                productIds);

                return new ResponseEntity<StoreCategoryDTO>(savedStoreCategory,
                                HttpStatus.OK);
        }

        @DeleteMapping("seller/stores/categories/{categoryId}")
        public ResponseEntity<String> DeleteCategory(@PathVariable Long categoryId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentEmail = authentication.getName();
                boolean isAdmin = authentication.getAuthorities().stream()
                                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

                String status = storeCategoryService.deleteCategory(categoryId, isAdmin ? null : currentEmail);
                return new ResponseEntity<String>(status, HttpStatus.OK);
        }
}
