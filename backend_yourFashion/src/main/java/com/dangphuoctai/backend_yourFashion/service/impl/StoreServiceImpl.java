package com.dangphuoctai.backend_yourFashion.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
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

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.entity.Address;
import com.dangphuoctai.backend_yourFashion.entity.Role;
import com.dangphuoctai.backend_yourFashion.entity.Store;
import com.dangphuoctai.backend_yourFashion.entity.User;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;

import com.dangphuoctai.backend_yourFashion.payloads.AddressDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreDTO;
import com.dangphuoctai.backend_yourFashion.payloads.StoreResponse;
import com.dangphuoctai.backend_yourFashion.repository.AddressRepo;
import com.dangphuoctai.backend_yourFashion.repository.RoleRepo;
import com.dangphuoctai.backend_yourFashion.repository.StoreRepo;
import com.dangphuoctai.backend_yourFashion.repository.UserRepo;
import com.dangphuoctai.backend_yourFashion.service.FileService;
import com.dangphuoctai.backend_yourFashion.service.StoreService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class StoreServiceImpl implements StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @Override
    public StoreDTO registerStore(StoreDTO storeDTO) {
        String email = storeDTO.getEmail();
        Store store = modelMapper.map(storeDTO, Store.class);
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Boolean checkStore = storeRepo.findByEmail(email).isPresent();
        if (checkStore) {
            throw new APIException("Store already exists !!!");
        }
        store.setLogo("default");
        store.setCreatedAt(LocalDate.now());
        store.setStatus(1);
        String country = storeDTO.getAddress().getCountry();
        String district = storeDTO.getAddress().getDistrict();
        String city = storeDTO.getAddress().getCity();
        String pincode = storeDTO.getAddress().getPincode();
        String ward = storeDTO.getAddress().getWard();
        String buildingName = storeDTO.getAddress().getBuildingName();
        Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                country, district,
                city, pincode, ward, buildingName);
        if (address == null) {
            address = new Address(country, district, city, pincode, ward, buildingName);
            address = addressRepo.save(address);
        }
        store.setAddresses(List.of(address));
        Store savedStore = storeRepo.save(store);
        Role roleSeller = roleRepo.findById(AppConstants.SELLER_ID).get();
        user.getRoles().add(roleSeller);
        storeDTO = modelMapper.map(savedStore, StoreDTO.class);
        storeDTO.setAddress(modelMapper.map(store.getAddresses().stream().findFirst().get(), AddressDTO.class));

        return storeDTO;
    }

    @Override
    public StoreResponse getAllStores(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Store> pageStores = storeRepo.findAll(pageDetails);
        List<Store> stores = pageStores.getContent();
        List<StoreDTO> storeDTOs = stores.stream().map(store -> {
            StoreDTO dto = modelMapper.map(store, StoreDTO.class);
            if (store.getAddresses().size() != 0) {
                dto.setAddress(modelMapper.map(store.getAddresses().stream().findFirst().get(), AddressDTO.class));
            }
            return dto;

        }).collect(Collectors.toList());

        StoreResponse storeResponse = new StoreResponse();
        storeResponse.setContent(storeDTOs);
        storeResponse.setPageNumber(pageStores.getNumber());
        storeResponse.setPageSize(pageStores.getSize());
        storeResponse.setTotalElements(pageStores.getTotalElements());
        storeResponse.setTotalPages(pageStores.getTotalPages());
        storeResponse.setLastPage(pageStores.isLast());
        return storeResponse;
    }

    @Override
    public StoreDTO getStoreById(Long storeId) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));
        StoreDTO storeDTO = modelMapper.map(store, StoreDTO.class);
        if (store.getAddresses() != null && !store.getAddresses().isEmpty()) {
            storeDTO.setAddress(modelMapper.map(store.getAddresses().stream().findFirst().get(), AddressDTO.class));
        }

        return storeDTO;
    }

    @Override
    public StoreDTO getStoreByEmail(String emailId) {
        Store store = storeRepo.findByEmail(emailId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "email", emailId));
        StoreDTO storeDTO = modelMapper.map(store, StoreDTO.class);
        if (store.getAddresses() != null && !store.getAddresses().isEmpty()) {
            storeDTO.setAddress(modelMapper.map(store.getAddresses().stream().findFirst().get(), AddressDTO.class));
        }

        return storeDTO;
    }

    @Override
    public StoreDTO updateStore(Long storeId, StoreDTO storeDTO, String email) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));
        if (email != null && !store.getEmail().equals(email)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        if (email == null) {
            store.setEmail(storeDTO.getEmail());
        }
        store.setStoreName(storeDTO.getStoreName());
        store.setMobileNumberStore(storeDTO.getMobileNumberStore());
        Integer status = storeDTO.getStatus();
        if (status != null) {
            store.setStatus(status);
        }
        if (storeDTO.getAddress() != null) {
            String country = storeDTO.getAddress().getCountry();
            String district = storeDTO.getAddress().getDistrict();
            String city = storeDTO.getAddress().getCity();
            String pincode = storeDTO.getAddress().getPincode();
            String ward = storeDTO.getAddress().getWard();
            String buildingName = storeDTO.getAddress().getBuildingName();

            Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                    country, district,
                    city, pincode, ward, buildingName);
            if (address == null) {
                address = new Address(country, district, city, pincode, ward, buildingName);
                address = addressRepo.save(address);
                store.setAddresses(List.of(address));
            } else {
                store.setAddresses(List.of(address));
            }
        }
        storeDTO = modelMapper.map(store, StoreDTO.class);
        storeDTO.setAddress(modelMapper.map(store.getAddresses().stream().findFirst().get(), AddressDTO.class));
        return storeDTO;
    }

    @Override
    public StoreDTO updateStoreImage(Long storeId, MultipartFile image, String email) throws IOException {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));
        if (email != null && !store.getEmail().equals(email)) {
            throw new AccessDeniedException("Bạn không có quyền truy cập thông tin này.");
        }
        String fileName = fileService.uploadImage(path, image);
        store.setLogo(fileName);
        Store updateStore = storeRepo.save(store);

        return modelMapper.map(updateStore, StoreDTO.class);
    }

    @Override
    public InputStream getStoreImage(String fileName) throws FileNotFoundException {

        return fileService.getResource(path, fileName);

    }

    @Override
    public String deleteStore(Long storeId) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "storeId", storeId));

        storeRepo.delete(store);

        return "Store with storetId: " + storeId + " deleted successfully !!! ";

    }

}
