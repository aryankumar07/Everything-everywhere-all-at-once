package com.example.security.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TokenController {

    @GetMapping("/token")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }

}
