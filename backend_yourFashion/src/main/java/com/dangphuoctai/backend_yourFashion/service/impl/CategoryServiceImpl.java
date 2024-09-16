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
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.entity.Category;
import com.dangphuoctai.backend_yourFashion.entity.Product;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.CategoryDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CategoryResponse;
import com.dangphuoctai.backend_yourFashion.repository.CategoryRepo;
import com.dangphuoctai.backend_yourFashion.service.CategoryService;
import com.dangphuoctai.backend_yourFashion.service.ProductService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryDTO createCategory(Category category) {
        Category savedCategory = categoryRepo.findByCategoryName(category.getCategoryName());

        // if (savedCategory != null) {
        //     throw new APIException("Category with the name '" + category.getCategoryName() + "' already exists !!! ");

        // }

        savedCategory = categoryRepo.save(category);

        return modelMapper.map(savedCategory, CategoryDTO.class);

    }

    @Override
    public CategoryResponse getCategories(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,String type) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Category> pageCategories ;
        if("parent".equals(type)){
            pageCategories = categoryRepo.findByCategoryParentNull(pageDetails);
        }else{
            pageCategories = categoryRepo.findAll(pageDetails);
        }

        List<Category> categories = pageCategories.getContent();

        // if (categories.size() == 0) {
        //     throw new APIException("No category is created till now");

        // }

        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class)).collect(Collectors.toList());

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setContent(categoryDTOs);
        categoryResponse.setPageNumber(pageCategories.getNumber());
        categoryResponse.setPageSize(pageCategories.getSize());
        categoryResponse.setTotalElements(pageCategories.getTotalElements());
        categoryResponse.setTotalPages(pageCategories.getTotalPages());
        categoryResponse.setLastPage(pageCategories.isLast());

        return categoryResponse;

    }

    @Override
    public CategoryDTO getCategoryById(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepo.findById(categoryId);

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            return modelMapper.map(category, CategoryDTO.class);
        } else {
            throw new ResourceNotFoundException("Category", "categoryId", categoryId);
        }
    }

    @Override
    public CategoryDTO updateCategory(Category category, Long categoryId) {
        Category savedCategory = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        category.setCategoryId(categoryId);

        savedCategory = categoryRepo.save(category);
        return modelMapper.map(savedCategory, CategoryDTO.class);

    }

    @Override
    public String deleteCategory(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        List<Product> products = category.getProducts();

        products.forEach(product -> {
            productService.deleteProduct(product.getProductId());

        });

        categoryRepo.delete(category);

        return "Category with categoryId: " + categoryId + " deleted successfully !!! ";

    }
}