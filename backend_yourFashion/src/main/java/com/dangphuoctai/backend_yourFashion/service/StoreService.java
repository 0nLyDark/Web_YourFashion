package com.dangphuoctai.backend_yourFashion.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.backend_yourFashion.payloads.StoreDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreResponse;

public interface StoreService {

    StoreDTO registerStore(StoreDTO storeDTO);

    StoreResponse getAllStores(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    StoreDTO getStoreById(Long storeId);

    StoreDTO getStoreByEmail(String emailId);

    StoreDTO updateStore(Long storeId, StoreDTO storeDTO ,String email);

    StoreDTO updateStoreImage(Long storeId, MultipartFile image, String email) throws IOException;

    public InputStream getStoreImage(String fileName) throws FileNotFoundException;

    String deleteStore(Long storeId);
}
