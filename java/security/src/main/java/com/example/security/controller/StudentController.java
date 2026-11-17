package com.example.security.controller;

import com.example.security.dto.StudentRequestDto;
import com.example.security.dto.StudentResponseDto;
import com.example.security.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/students")
    public List<StudentResponseDto> getStudents() {
        return studentService.getStudents();
    }

    @PostMapping("/students")
    public ResponseEntity<StudentResponseDto> createStudent(@RequestBody StudentRequestDto studentRequestDto) {
        StudentResponseDto created = studentService.createStudent(studentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

}
