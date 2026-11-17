package com.example.security.mapper;

import com.example.security.dto.StudentRequestDto;
import com.example.security.dto.StudentResponseDto;
import com.example.security.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student toEntity(StudentRequestDto dto) {
        return new Student(dto.getName(), dto.getAge(), dto.getRollNo());
    }

    public StudentResponseDto toResponseDto(Student student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setName(student.getName());
        dto.setCreatedAt(student.getCreatedAt());
        return dto;
    }
}
