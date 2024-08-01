package com.cheong.backend.mapper;

import com.cheong.backend.domain.Product;
import com.cheong.backend.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO mapToProductDTO(Product product){
        return ProductDTO
                .builder()
                .code(product.getCode())
                .name(product.getName())
                .category(product.getCategory())
                .brand(product.getBrand())
                .type(product.getType())
                .description(product.getDescription())
                .build();
    }

    public static Product mapToProduct(ProductDTO productDTO){
        Product product = new Product();
        product.setBrand(productDTO.getBrand());
        product.setType(productDTO.getType());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setCode(productDTO.getCode());
        product.setCategory(productDTO.getCategory());
        return product;
    }
}
