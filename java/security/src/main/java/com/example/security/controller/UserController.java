package com.example.security.controller;

import com.example.security.dto.UserRequestDto;
import com.example.security.dto.UserResponseDto;
import com.example.security.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody UserRequestDto userRequestDto) {
        UserResponseDto saved =  authService.register(userRequestDto);
        return ResponseEntity.ok(saved);
    }


}
