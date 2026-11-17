package com.aryan.shop.service;

import com.aryan.shop.model.Product;
import com.aryan.shop.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProduct() {
        return  repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProdct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());
        Product savedProduct =  repo.save(product);
        return savedProduct;
    }

    public Product updateProduct(int id, Product product, MultipartFile image) throws IOException {
        Product existing = repo.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        product.setId(id);
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        } else {
            // no new image sent, keep the old one
            product.setImageName(existing.getImageName());
            product.setImageType(existing.getImageType());
            product.setImageData(existing.getImageData());
        }
        return repo.save(product);
    }

    public boolean deleteProduct(int id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }

    public List<Product> searchProduct(String keyword) {
        return repo.searchByKeyword(keyword);
    }


}
