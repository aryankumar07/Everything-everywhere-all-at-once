package org.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Alien {

    public String name;
    public  Computer comp;

    public void setName(String name) {
        this.name = name;
    }

    public void setComp(Computer comp) {
        this.comp = comp;
    }

    public void code() {
        comp.compile();
    }
}
