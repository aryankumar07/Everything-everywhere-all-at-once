package org.spring;

import org.springframework.stereotype.Component;


@Component
public class Desktop implements  Computer{

    public int age;

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public void compile() {
        System.out.println("desktop");
        System.out.println(age);
    }
}
