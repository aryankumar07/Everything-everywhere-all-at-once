package com.example.security.service;

import com.example.security.dto.UserRequestDto;
import com.example.security.dto.UserResponseDto;
import com.example.security.entity.Role;
import com.example.security.entity.User;
import com.example.security.repository.RoleRepository;
import com.example.security.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;


    public UserResponseDto register(UserRequestDto userRequestDto) {
        User user = new User();
        user.setUsername(userRequestDto.getUsername());
        user.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        user.setEnabled(true);

        Role role = roleRepository.findByName("ROLE_USER").get();

        user.getRoles().add(role);

        User saved =  userRepository.save(user);
        return new UserResponseDto(saved.getUsername() , "User is saved");
    }

}
