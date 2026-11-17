package com.aryan.shop.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String description;
    private String brand;
    private String category;
    private Date data;
    private BigDecimal price;
    private Integer stock;
    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;


}
