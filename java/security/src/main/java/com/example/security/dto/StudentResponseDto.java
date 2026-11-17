package com.example.security.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class StudentResponseDto {
    private String name;
    private LocalDateTime createdAt;
}
