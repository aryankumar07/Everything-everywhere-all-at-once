package com.example.demo;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.util.List;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(DemoApplication.class, args);

		Student st = context.getBean(Student.class);
		st.setAge(2);
		st.setName("aryan");
		st.setRollNo(1);

		Student st1 = context.getBean(Student.class);
		st.setAge(2);
		st.setName("aryan2");
		st.setRollNo(2);

		StudentService service = context.getBean(StudentService.class);

		service.save(st);
		service.save(st1);

		List<Student> val =  service.getAll();

		System.out.println(val);


	}


}
