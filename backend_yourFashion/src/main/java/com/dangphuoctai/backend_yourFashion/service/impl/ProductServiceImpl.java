package com.dangphuoctai.backend_yourFashion.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.backend_yourFashion.entity.Cart;
import com.dangphuoctai.backend_yourFashion.entity.Category;
import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.entity.Store;
import com.dangphuoctai.backend_yourFashion.entity.StoreCategory;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.CartDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CartItemDTO;
import com.dangphuoctai.backend_yourFashion.payloads.ProductDTO;
import com.dangphuoctai.backend_yourFashion.payloads.ProductResponse;
import com.dangphuoctai.backend_yourFashion.repository.CartRepo;
import com.dangphuoctai.backend_yourFashion.repository.CategoryRepo;
import com.dangphuoctai.backend_yourFashion.repository.ProductRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreCategoryRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreRepo;
import com.dangphuoctai.backend_yourFashion.service.CartService;
import com.dangphuoctai.backend_yourFashion.service.FileService;
import com.dangphuoctai.backend_yourFashion.service.ProductService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private StoreCategoryRepo storeCategoryRepo;

    @Autowired
    private CartService cartService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ModelMapper modelMapper;

    @Value("${project.image}")
    private String path;

    @Override
    public ProductDTO addProduct(Long categoryId, String email, Product product) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
        Store store = storeRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "email", email));
        boolean isProductNotPresent = true;

        List<Product> products = store.getProducts();
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getProductName().equals(product.getProductName())
                    && products.get(i).getDescription().equals(product.getDescription())) {
                isProductNotPresent = false;
                break;
            }
        }

        if (isProductNotPresent) {
            product.setStore(store);
            product.setImage("default.png");

            product.setCategory(category);

            double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
            product.setSpecialPrice(specialPrice);

            Product savedProduct = productRepo.save(product);

            return modelMapper.map(savedProduct, ProductDTO.class);
        } else {
            throw new APIException("Product already exists !!! ");

        }
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
            Boolean sale) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts;
        if (sale) {
            pageProducts = productRepo.findByDiscountNot(0, pageDetails);
        } else {
            pageProducts = productRepo.findAll(pageDetails);
        }

        List<Product> products = pageProducts.getContent();
        List<ProductDTO> productDTOs = products.stream().map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();

        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductResponse getProductByStore(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
            Boolean sale, Long storeId) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Product> pageProducts;
        if (sale) {
            pageProducts = productRepo.findByDiscountNotAndStoreStoreId(0, storeId, pageDetails);
        } else {
            pageProducts = productRepo.findByStoreStoreId(storeId, pageDetails);
        }
        List<Product> products = pageProducts.getContent();

        List<ProductDTO> productDTOs = products.stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;

    }

    @Override
    public ProductResponse getProductsByStoreAndStoreCategory(Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder,
            Boolean sale, Long storeId, Long categoryId) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));
        StoreCategory storeCategory = storeCategoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("StoreCategory", "categoryId", categoryId));
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Product> pageProducts = productRepo.findByStoreCategoryCategoryId(categoryId, pageDetails);

        List<Product> products = pageProducts.getContent();

        List<ProductDTO> productDTOs = products.stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;

    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Optional<Product> productOptional = productRepo.findById(productId);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return modelMapper.map(product, ProductDTO.class);
        } else {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }
    }

    public List<Long> getListCategoryId(Category category) {
        List<Long> listId = new ArrayList<>();
        listId.add(category.getCategoryId());
        category.getCategoryChildren().forEach(childCategory -> {
            listId.addAll(getListCategoryId(childCategory));
        });

        return listId;
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder, Boolean sale) {

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId",
                        categoryId));
        List<Long> categoryIds = new ArrayList<>();
        categoryIds.addAll(getListCategoryId(category));

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Product> pageProducts;
        if (sale) {
            pageProducts = productRepo.findByDiscountNotAndCategoryCategoryIdIn(0, categoryIds, pageDetails);
        } else {
            pageProducts = productRepo.findByCategoryCategoryIdIn(categoryIds, pageDetails);
        }
        List<Product> products = pageProducts.getContent();

        // if (products.isEmpty()) {
        // throw new APIException(category.getCategoryName() + " category doesn't
        // contain any products !!! ");
        // }
        List<ProductDTO> productDTOs = products.stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortOrder, Boolean sale) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts;
        if (sale) {
            pageProducts = productRepo.findByDiscountNotAndProductNameLike(0, "%" + keyword + "%", pageDetails);
        } else {
            pageProducts = productRepo.findByProductNameLike("%" + keyword + "%", pageDetails);
        }

        List<Product> products = pageProducts.getContent();

        // if (products.isEmpty()) {
        // throw new APIException("Products not found with keyword: " + keyword);

        if (categoryId != 0 && categoryId != null) {
            Category category = categoryRepo.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
            List<Long> categoryIds = new ArrayList<>();
            categoryIds.addAll(getListCategoryId(category));
            products = products.stream()
                    .filter(product -> {
                        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
                            Long productCategoryId = product.getCategory().getCategoryId();
                            return categoryIds.contains(productCategoryId);
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }

        // if (products.isEmpty()) {
        // System.out.println("Filtered products count: " + products.size()); //
        // Debugging line
        // throw new APIException("Products not found with keyword: " + keyword + " and
        // categoryId: " + categoryId);

        List<ProductDTO> productDTOs = products.stream()
                .map(p -> modelMapper.map(p, ProductDTO.class))
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements((long) products.size());
        productResponse.setTotalPages((int) Math.ceil((double) products.size() / pageSize));
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(Long productId, Product product, String email) {
        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        if (email != null && !productFromDB.getStore().getEmail().equals(email)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }

        product.setImage(productFromDB.getImage());
        product.setProductId(productId);
        product.setStore(productFromDB.getStore());
        product.setStoreCategories(productFromDB.getStoreCategories());
        // product.setCategory(productFromDB.getCategory());
        double specialPrice = product.getPrice() - ((product.getDiscount() * 0.01) * product.getPrice());
        product.setSpecialPrice(specialPrice);

        Product savedProduct = productRepo.save(product);
        List<Cart> carts = cartRepo.findCartsByProductId(productId);
        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<CartItemDTO> cartItems = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p, CartItemDTO.class)).collect(Collectors.toList());
            cartDTO.setCartItems(cartItems);

            return cartDTO;

        }).collect(Collectors.toList());

        cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image, String email) throws IOException {
        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        if (email != null && !productFromDB.getStore().getEmail().equals(email)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }

        String fileName = fileService.uploadImage(path, image);

        productFromDB.setImage(fileName);

        Product updatedProduct = productRepo.save(productFromDB);
        return modelMapper.map(updatedProduct, ProductDTO.class);

    }

    @Override
    public String deleteProduct(Long productId, String email) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (email != null && !product.getStore().getEmail().equals(email)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }

        List<Cart> carts = cartRepo.findCartsByProductId(productId);

        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

        productRepo.delete(product);

        return "Product with productId: " + productId + " deleted successfully !!! ";
    }

    @Override
    public String deleteProduct(Long productId) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        List<Cart> carts = cartRepo.findCartsByProductId(productId);

        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

        productRepo.delete(product);

        return "Product with productId: " + productId + " deleted successfully !!! ";
    }

    @Override
    public InputStream getProductImage(String fileName) throws FileNotFoundException {

        return fileService.getResource(path, fileName);

    }
}