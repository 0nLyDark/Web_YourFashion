package com.dangphuoctai.backend_yourFashion.service;

import com.dangphuoctai.backend_yourFashion.payloads.UserDTO;
import com.dangphuoctai.backend_yourFashion.payloads.UserResponse;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);

    UserDTO getUserByEmail(String email);

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO getUserById(Long userId);

    UserDTO updateUser(Long userId, UserDTO userDTO);

    String deleteUser(Long userId);
}
