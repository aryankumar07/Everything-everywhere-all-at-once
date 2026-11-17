package com.example.security.service;

import com.example.security.entity.Role;
import com.example.security.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoleService {

    private RoleRepository roleRepository;

    public Role create(Role role) {
        Role savedRole = roleRepository.save(role);
        return savedRole;
    }

}
