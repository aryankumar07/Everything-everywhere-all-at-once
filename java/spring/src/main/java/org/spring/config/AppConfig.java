package org.spring.config;

import org.spring.Desktop;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
@ComponentScan("org.spring")
public class AppConfig {
//    @Bean
////    @Scope("prototype")
//    public Desktop desktop() {
//        return  new Desktop();
//    }
}
