package com.aryan.shop.controller;

import com.aryan.shop.model.Product;
import com.aryan.shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin
public class productController {

    @Autowired
    private ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return new ResponseEntity<>(service.getAllProduct(),HttpStatus.ACCEPTED);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") int id) {

        Product product = service.getProductById(id);

        if(product == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile image ) {
        try {
            Product saved =  service.addProdct(product, image);
            return new ResponseEntity<>(saved , HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") int id,
                                           @RequestPart Product product,
                                           @RequestPart(required = false) MultipartFile image) {
        try {
            Product updated = service.updateProduct(id, product, image);
            if (updated == null) {
                return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int id) {
        if (!service.deleteProduct(id)) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Deleted", HttpStatus.OK);
    }

    @GetMapping("/product/search")
    public ResponseEntity<?> searchProduct(@RequestParam String keyword ) {
        List<Product> prod = service.searchProduct(keyword);
        if(prod == null) {
            return new ResponseEntity<>("No Match found" , HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(prod, HttpStatus.FOUND);
    }


}
