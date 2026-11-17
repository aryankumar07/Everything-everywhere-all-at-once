package com.example.security.controller;

import com.example.security.entity.Role;
import com.example.security.service.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/role")
public class RoleController {

    private RoleService roleService;

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role saved =  roleService.create(role);
        return ResponseEntity.ok(saved);
    }

}
