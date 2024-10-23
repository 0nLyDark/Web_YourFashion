package com.dangphuoctai.backend_yourFashion.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.payloads.StoreDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreResponse;
import com.dangphuoctai.backend_yourFashion.service.StoreService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

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

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @PostMapping("/public/stores")
    public ResponseEntity<StoreDTO> registerStore(@RequestBody StoreDTO storeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        // Nếu không phải admin, chỉ cho phép người dùng truy cập thông tin của họ
        if (!storeDTO.getEmail().equals(currentEmail)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        StoreDTO store = storeService.registerStore(storeDTO);

        return new ResponseEntity<StoreDTO>(store, HttpStatus.OK);

    }

    @GetMapping("/public/stores")
    public ResponseEntity<StoreResponse> getAllStores(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_STORES_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        StoreResponse storeResponse = storeService.getAllStores(
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "storeId" : sortBy,
                sortOrder);

        return new ResponseEntity<StoreResponse>(storeResponse, HttpStatus.OK);

    }

    @GetMapping("/public/stores/{storeId}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long storeId) {

        StoreDTO store = storeService.getStoreById(storeId);

        return new ResponseEntity<StoreDTO>(store, HttpStatus.OK);
    }

    @GetMapping("/public/stores/email/{emailId}")
    public ResponseEntity<StoreDTO> getStoreByEmail(@PathVariable String emailId) {

        StoreDTO store = storeService.getStoreByEmail(emailId);

        return new ResponseEntity<StoreDTO>(store, HttpStatus.OK);
    }

    @PutMapping("/seller/stores/{storeId}")
    public ResponseEntity<StoreDTO> putMethodName(@PathVariable Long storeId, @RequestBody StoreDTO storeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

        StoreDTO store = storeService.updateStore(storeId, storeDTO,isAdmin ? null : currentEmail);

        return new ResponseEntity<StoreDTO>(store, HttpStatus.OK);
    }

    @GetMapping("/public/stores/image/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = storeService.getStoreImage(fileName);
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);

        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    @PutMapping("/seller/stores/{storeId}/image")
    public ResponseEntity<StoreDTO> updateStoreImage(@PathVariable Long storeId,
            @RequestParam("image") MultipartFile image) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(ga -> ga.getAuthority().equals("ADMIN"));

        StoreDTO updateStore = storeService.updateStoreImage(storeId, image, isAdmin ? null : currentEmail);

        return new ResponseEntity<StoreDTO>(updateStore, HttpStatus.OK);
    }

    @DeleteMapping("/seller/stores/{storeId}")
    public ResponseEntity<String> deleteStore(@PathVariable Long storeId) {
        String status = storeService.deleteStore(storeId);

        return new ResponseEntity<String>(status, HttpStatus.OK);

    }

}
