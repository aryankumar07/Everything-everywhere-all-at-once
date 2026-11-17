package com.example.security.service;

import com.example.security.dto.StudentRequestDto;
import com.example.security.dto.StudentResponseDto;
import com.example.security.entity.Student;
import com.example.security.mapper.StudentMapper;
import com.example.security.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public List<StudentResponseDto> getStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toResponseDto)
                .toList();
    }

    public StudentResponseDto createStudent(StudentRequestDto studentRequestDto) {
        Student student = studentMapper.toEntity(studentRequestDto);
        Student saved = studentRepository.save(student);
        return studentMapper.toResponseDto(saved);
    }

}
