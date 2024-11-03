package com.dangphuoctai.backend_yourFashion.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.config.AppConstants;
import com.dangphuoctai.backend_yourFashion.entity.Address;
import com.dangphuoctai.backend_yourFashion.entity.Cart;
import com.dangphuoctai.backend_yourFashion.entity.Role;
import com.dangphuoctai.backend_yourFashion.entity.User;
import com.dangphuoctai.backend_yourFashion.exceptions.APIException;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.payloads.AddressDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CartDTO;
import com.dangphuoctai.backend_yourFashion.payloads.CartItemDTO;
import com.dangphuoctai.backend_yourFashion.payloads.UserDTO;
import com.dangphuoctai.backend_yourFashion.payloads.UserResponse;
import com.dangphuoctai.backend_yourFashion.repository.AddressRepo;
import com.dangphuoctai.backend_yourFashion.repository.RoleRepo;
import com.dangphuoctai.backend_yourFashion.repository.UserRepo;
import com.dangphuoctai.backend_yourFashion.service.UserService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class UserServiceImpl implements UserService {
        @Autowired
        private UserRepo userRepo;

        @Autowired
        private RoleRepo roleRepo;

        @Autowired
        private AddressRepo addressRepo;

        // @Autowired
        // private CartService cartService;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private ModelMapper modelMapper;

        @Override
        public UserDTO registerUser(UserDTO userDTO) {

                try {
                        User user = modelMapper.map(userDTO, User.class);
                        Cart cart = new Cart();
                        cart.setUser(user);
                        user.setCart(cart);

                        Role role = roleRepo.findById(AppConstants.USER_ID).get();
                        user.getRoles().addAll(userDTO.getRoles());
                        user.getRoles().add(role);

                        String country = userDTO.getAddress().getCountry();
                        String district = userDTO.getAddress().getDistrict();
                        String city = userDTO.getAddress().getCity();
                        String pincode = userDTO.getAddress().getPincode();
                        String ward = userDTO.getAddress().getWard();
                        String buildingName = userDTO.getAddress().getBuildingName();

                        Address address = addressRepo
                                        .findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                                                        country, district,
                                                        city, pincode, ward, buildingName);
                        if (address == null) {
                                address = new Address(country, district, city, pincode, ward, buildingName);
                                address = addressRepo.save(address);
                        }
                        user.setAddresses(List.of(address));

                        User registeredUser = userRepo.save(user);
                        cart.setUser(registeredUser);

                        userDTO = modelMapper.map(registeredUser, UserDTO.class);

                        userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(),
                                        AddressDTO.class));
                        userDTO.setPassword("");
                        return userDTO;
                } catch (DataIntegrityViolationException e) {
                        throw new APIException("User already exists with emailId: " +
                                        userDTO.getEmail() + e);
                }
        }

        @Override
        public UserDTO getUserByEmail(String email) {
                User user = userRepo.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
                UserDTO userDTO = modelMapper.map(user, UserDTO.class);

                if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
                        userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(),
                                        AddressDTO.class));
                }
                if (user.getCart() != null) {
                        CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);
                        // List<ProductDTO> products = user.getCart().getCartItems().stream()
                        // .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                        // .collect(Collectors.toList());

                        // cart.setProducts(products);
                        List<CartItemDTO> cartItems = user.getCart().getCartItems().stream()
                                        .map(item -> modelMapper.map(item, CartItemDTO.class))
                                        .collect(Collectors.toList());

                        cart.setCartItems(cartItems);
                        userDTO.setCart(cart);
                }
                userDTO.setPassword("");
                return userDTO;

        }

        @Override
        public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

                Page<User> pageUsers = userRepo.findAll(pageDetails);

                List<User> users = pageUsers.getContent();

                // if (users.isEmpty()) {
                // throw new APIException("No User exists !!! " + pageUsers);
                // }
                List<UserDTO> userDTOs = users.stream().map(user -> {
                        UserDTO dto = modelMapper.map(user, UserDTO.class);
                        if (user.getAddresses().size() != 0) {
                                dto.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(),
                                                AddressDTO.class));
                        }
                        CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);

                        // List<ProductDTO> products = user.getCart().getCartItems().stream()
                        // .map(item -> modelMapper.map(item.getProduct(),
                        // ProductDTO.class))
                        // .collect(Collectors.toList());
                        // dto.getCart().setProducts(products);
                        List<CartItemDTO> cartItems = user.getCart().getCartItems().stream()
                                        .map(item -> modelMapper.map(item, CartItemDTO.class))
                                        .collect(Collectors.toList());

                        cart.setCartItems(cartItems);
                        dto.setCart(cart);

                        dto.setPassword("");

                        return dto;

                }).collect(Collectors.toList());

                UserResponse userResponse = new UserResponse();

                userResponse.setContent(userDTOs);
                userResponse.setPageNumber(pageUsers.getNumber());
                userResponse.setPageSize(pageUsers.getSize());
                userResponse.setTotalElements(pageUsers.getTotalElements());
                userResponse.setTotalPages(pageUsers.getTotalPages());
                userResponse.setLastPage(pageUsers.isLast());

                return userResponse;
        }

        @Override
        public UserDTO getUserById(Long userId) {
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

                UserDTO userDTO = modelMapper.map(user, UserDTO.class);

                userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
                CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);
                // List<ProductDTO> products = user.getCart().getCartItems().stream()
                // .map(item -> modelMapper.map(item.getProduct(),
                // ProductDTO.class))
                // .collect(Collectors.toList());
                // userDTO.getCart().set(products);

                List<CartItemDTO> cartItems = user.getCart().getCartItems().stream()
                                .map(item -> modelMapper.map(item, CartItemDTO.class))
                                .collect(Collectors.toList());
                userDTO.getCart().setCartItems(cartItems);

                userDTO.setCart(cart);
                userDTO.setPassword("");

                return userDTO;
        }

        @Override
        public UserDTO updateUser(Long userId, UserDTO userDTO) {
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

                // String encodedPass = passwordEncoder.encode(userDTO.getPassword());

                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                user.setMobileNumber(userDTO.getMobileNumber());
                user.setEmail(userDTO.getEmail());
                // user.setPassword(encodedPass);
                Role roleAdmin = roleRepo.findById(AppConstants.ADMIN_ID).get();
                if (userDTO.getRoles().iterator().next().getRoleId().equals(AppConstants.ADMIN_ID)) {
                        if (!user.getRoles().contains(roleAdmin)) {
                                user.getRoles().add(roleAdmin);
                        }
                } else {
                        user.getRoles().remove(roleAdmin);
                }
                if (userDTO.getAddress() != null) {
                        String country = userDTO.getAddress().getCountry();
                        String district = userDTO.getAddress().getDistrict();
                        String city = userDTO.getAddress().getCity();
                        String pincode = userDTO.getAddress().getPincode();
                        String ward = userDTO.getAddress().getWard();
                        String buildingName = userDTO.getAddress().getBuildingName();

                        Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                                        country, district,
                                        city, pincode, ward, buildingName);
                        if (address == null) {
                                address = new Address(country, district, city, pincode, ward, buildingName);
                                address = addressRepo.save(address);
                                user.setAddresses(List.of(address));
                        } else {
                                user.setAddresses(List.of(address));
                        }
                }

                userDTO = modelMapper.map(user, UserDTO.class);
                userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));

                CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);
                List<CartItemDTO> cartItems = user.getCart().getCartItems().stream()
                                .map(item -> modelMapper.map(item, CartItemDTO.class))
                                .collect(Collectors.toList());
                userDTO.getCart().setCartItems(cartItems);
                userDTO.setCart(cart);
                // userDTO.getCart().setProducts(products);
                userDTO.setPassword("");

                return userDTO;
        }

        @Override
        public UserDTO updateUserByEmail(String email, UserDTO userDTO) {
                User user = userRepo.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                user.setMobileNumber(userDTO.getMobileNumber());
                if (userDTO.getAddress() != null) {
                        String country = userDTO.getAddress().getCountry();
                        String district = userDTO.getAddress().getDistrict();
                        String city = userDTO.getAddress().getCity();
                        String pincode = userDTO.getAddress().getPincode();
                        String ward = userDTO.getAddress().getWard();
                        String buildingName = userDTO.getAddress().getBuildingName();

                        Address address = addressRepo.findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(
                                        country, district,
                                        city, pincode, ward, buildingName);
                        if (address == null) {
                                address = new Address(country, district, city, pincode, ward, buildingName);
                                address = addressRepo.save(address);
                                user.setAddresses(List.of(address));
                        } else {
                                user.setAddresses(List.of(address));
                        }
                }

                userDTO = modelMapper.map(user, UserDTO.class);
                userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));

                CartDTO cart = modelMapper.map(user.getCart(), CartDTO.class);
                List<CartItemDTO> cartItems = user.getCart().getCartItems().stream()
                                .map(item -> modelMapper.map(item, CartItemDTO.class))
                                .collect(Collectors.toList());
                userDTO.getCart().setCartItems(cartItems);
                userDTO.setCart(cart);

                userDTO.setPassword("");

                return userDTO;
        }

        @Override
        public String deleteUser(Long userId) {
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

                // List<CartItem> cartItems = user.getCart().getCartItems();
                // Long cartId = user.getCart().getCartId();
                // cartItems.forEach(item -> {

                // Long productId = item.getProduct().getProductId();

                // cartService.deleteProductFromCart(cartId, productId);
                // });

                userRepo.delete(user);

                return "User with userId " + userId + " deleted successfully !!! ";

        }

}
