package com.dangphuoctai.backend_yourFashion.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.entity.Store;
import com.dangphuoctai.backend_yourFashion.entity.StoreCategory;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreCategoryResponse;
import com.dangphuoctai.backend_yourFashion.repository.ProductRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreCategoryRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreRepo;
import com.dangphuoctai.backend_yourFashion.service.StoreCategoryService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class StoreCategoryServiceImpl implements StoreCategoryService {

        @Autowired
        private StoreRepo storeRepo;
        @Autowired
        private StoreCategoryRepo storeCategoryRepo;

        @Autowired
        private ProductRepo productRepo;

        @Autowired
        private ModelMapper modelMapper;

        public StoreCategoryDTO createCategory(String email, StoreCategoryDTO storeCategoryDTO) {
                StoreCategory savedStoreCategory = storeCategoryRepo.findByStoreEmailAndCategoryName(email,
                                storeCategoryDTO.getCategoryName());
                if (savedStoreCategory != null) {
                        throw new APIException(
                                        "Category with the name '" + storeCategoryDTO.getCategoryName()
                                                        + "' already exists !!! ");
                }
                StoreCategory storeCategory = modelMapper.map(storeCategoryDTO,
                                StoreCategory.class);
                Store store = storeRepo.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Store", "email", email));
                storeCategory.setStatus(true);
                storeCategory.setStore(store);
                // store.getStoreCategories().add(storeCategory);

                savedStoreCategory = storeCategoryRepo.save(storeCategory);

                return modelMapper.map(savedStoreCategory, StoreCategoryDTO.class);

        }

        public StoreCategoryResponse getAllCategory(Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder, Long storeId) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

                Page<StoreCategory> pageCategories = storeCategoryRepo.findAll(pageDetails);

                List<StoreCategory> categories = pageCategories.getContent();
                List<StoreCategoryDTO> categoryDTOs = categories.stream()
                                .map(category -> modelMapper.map(category, StoreCategoryDTO.class))
                                .collect(Collectors.toList());

                StoreCategoryResponse storeCategoryResponse = new StoreCategoryResponse();

                storeCategoryResponse.setContent(categoryDTOs);
                storeCategoryResponse.setPageNumber(pageCategories.getNumber());
                storeCategoryResponse.setPageSize(pageCategories.getSize());
                storeCategoryResponse.setTotalElements(pageCategories.getTotalElements());
                storeCategoryResponse.setTotalPages(pageCategories.getTotalPages());
                storeCategoryResponse.setLastPage(pageCategories.isLast());
                return storeCategoryResponse;
        }

        @Override
        public StoreCategoryResponse getCatgoryByStoreId(Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder, Long storeId) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
                Page<StoreCategory> pageCategories = storeCategoryRepo.findStoreCategoryByStoreId(storeId, pageDetails);
                List<StoreCategory> categories = pageCategories.getContent();
                List<StoreCategoryDTO> categoryDTOs = categories.stream()
                                .map(category -> modelMapper.map(category, StoreCategoryDTO.class))
                                .collect(Collectors.toList());

                StoreCategoryResponse storeCategoryResponse = new StoreCategoryResponse();

                storeCategoryResponse.setContent(categoryDTOs);
                storeCategoryResponse.setPageNumber(pageCategories.getNumber());
                storeCategoryResponse.setPageSize(pageCategories.getSize());
                storeCategoryResponse.setTotalElements(pageCategories.getTotalElements());
                storeCategoryResponse.setTotalPages(pageCategories.getTotalPages());
                storeCategoryResponse.setLastPage(pageCategories.isLast());
                return storeCategoryResponse;
        }

        public StoreCategoryDTO getCatgoryById(Long categoryId) {
                Optional<StoreCategory> storeCategoryOptional = storeCategoryRepo.findById(categoryId);
                if (storeCategoryOptional.isPresent()) {
                        StoreCategory storeCategory = storeCategoryOptional.get();
                        return modelMapper.map(storeCategory, StoreCategoryDTO.class);
                } else {
                        throw new ResourceNotFoundException("StoreCategory", "categoryId", categoryId);
                }
        }

        public StoreCategoryDTO addProductToCategory(String email, Long categoryId, List<Long> productIds) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                List<Product> products;
                if (email == null) {
                        products = productRepo.findAllById(productIds);
                } else {
                        products = productRepo.findAllByStoreEmailAndProductIds(email, productIds);
                }
                if (products.size() == 0) {
                        throw new ResourceNotFoundException("Product", "productIds", productIds);
                }
                List<Product> listpProducts = storeCategory.getProducts();
                for (Product product : products) {
                        if (!product.getStoreCategories().contains(storeCategory)) {
                                product.getStoreCategories().add(storeCategory);
                        }
                }
                listpProducts.addAll(products);
                storeCategory.setProducts(listpProducts);

                StoreCategory savedStoreCategory = storeCategoryRepo.save(storeCategory);

                return modelMapper.map(savedStoreCategory, StoreCategoryDTO.class);

        }

        public StoreCategoryDTO removeProductToStoreCategory(String email, Long categoryId, List<Long> productIds) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                List<Product> products;
                if (email == null) {
                        products = productRepo.findAllById(productIds);
                } else {
                        products = productRepo.findAllByStoreEmailAndProductIds(email, productIds);
                }
                if (products.size() == 0) {
                        throw new ResourceNotFoundException("Product", "productIds", productIds);
                }

                List<Product> listpProducts = storeCategory.getProducts();
                for (Product product : products) {
                        if (product.getStoreCategories().contains(storeCategory)) {
                                product.getStoreCategories().remove(storeCategory);
                        }
                }
                listpProducts.removeAll(products);
                storeCategory.setProducts(products);
                StoreCategory savedStoreCategory = storeCategoryRepo.save(storeCategory);

                return modelMapper.map(savedStoreCategory, StoreCategoryDTO.class);

        }

        public StoreCategoryDTO addProductToCategory(String email, Long categoryId, Long productId) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                Product product = productRepo.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
                if (email != null && !product.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }

                if (!storeCategory.getProducts().contains(product)) {
                        product.getStoreCategories().add(storeCategory);
                        storeCategory.getProducts().add(product);
                }

                StoreCategory savedStoreCategory = storeCategoryRepo.save(storeCategory);

                return modelMapper.map(savedStoreCategory, StoreCategoryDTO.class);

        }

        public StoreCategoryDTO removeProductToStoreCategory(String email, Long categoryId, Long productId) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                Product product = productRepo.findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
                if (email != null && !product.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }

                List<Product> products = storeCategory.getProducts();
                if (product.getStoreCategories().contains(storeCategory)) {
                        product.getStoreCategories().remove(storeCategory);
                        storeCategory.getProducts().remove(product);
                } else {
                        throw new ResourceNotFoundException("Product By StoreCategory", "ProductId", productId);
                }

                productRepo.save(product);
                StoreCategory savedStoreCategory = storeCategoryRepo.save(storeCategory);

                return modelMapper.map(savedStoreCategory, StoreCategoryDTO.class);

        }

        public StoreCategoryDTO updateCategory(String email, Long categoryId, StoreCategoryDTO storeCategoryDTO) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                storeCategory.setCategoryName(storeCategoryDTO.getCategoryName());
                storeCategory.setStatus(storeCategoryDTO.isStatus());

                return modelMapper.map(storeCategory, StoreCategoryDTO.class);

        }

        public String deleteCategory(Long categoryId, String email) {
                StoreCategory storeCategory = storeCategoryRepo.findById(categoryId).orElseThrow(
                                () -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
                if (email != null && !storeCategory.getStore().getEmail().equals(email)) {
                        throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
                }
                for (Product product : storeCategory.getProducts()) {
                        product.getStoreCategories().remove(storeCategory);
                }
                storeCategory.setProducts(null);
                storeCategoryRepo.delete(storeCategory);
                return "StoreCategory with categoryId: " + categoryId + " deleted successfully !!! ";

        }
}
