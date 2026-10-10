package com.example.demo.repo;

import com.example.demo.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentRepo {

    private JdbcTemplate jdbc;

    @Autowired
    public void setJdbc(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(Student s) {
        String sql = "INSERT INTO student (rollno, name, age) VALUES (?, ?, ?)";
        jdbc.update(sql, s.getRollNo(), s.getName(), s.getAge());
    }

    public List<Student> findAll() {
        RowMapper<Student> mapper = (rs, rowNum) -> {
            Student s = new Student();
            s.setRollNo(rs.getInt("rollno"));
            s.setName(rs.getString("name"));
            s.setAge(rs.getInt("age"));
            return s;
        };
        return jdbc.query("SELECT * FROM student", mapper);
    }
}
