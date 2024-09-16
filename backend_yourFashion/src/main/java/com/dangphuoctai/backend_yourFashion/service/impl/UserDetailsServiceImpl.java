package com.dangphuoctai.backend_yourFashion.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dangphuoctai.backend_yourFashion.config.UserInfoConfig;
import com.dangphuoctai.backend_yourFashion.entity.User;
import com.dangphuoctai.backend_yourFashion.exceptions.ResourceNotFoundException;
import com.dangphuoctai.backend_yourFashion.repository.UserRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByEmail(username);

        return user.map(UserInfoConfig::new)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", username));
    }
}