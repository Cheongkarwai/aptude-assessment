package com.cheong.backend.service;

import com.cheong.backend.domain.Product;
import com.cheong.backend.dto.ProductDTO;
import com.cheong.backend.mapper.ProductMapper;
import com.cheong.backend.repository.ProductRepository;
import org.hibernate.annotations.Cache;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.NoSuchElementException;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Cacheable(cacheNames = {"productPage"}, key = "#pageable")
    public Page<ProductDTO> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductMapper::mapToProductDTO);
    }

    @Cacheable(cacheNames = {"products"})
    public ProductDTO findByCode(String code) {
        Product product = productRepository.findById(code)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        return ProductMapper.mapToProductDTO(product);
    }

    @CacheEvict(cacheNames = {"productPage", "products"}, allEntries = true)
    public void save(ProductDTO productDTO) {
        Product product = ProductMapper.mapToProduct(productDTO);
        productRepository.save(product);
    }

    @CacheEvict(cacheNames = {"productPage", "products"}, allEntries = true)
    public void update(String code, ProductDTO productDTO) {
        Product product = productRepository.findById(code)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        if (StringUtils.hasText(productDTO.getName())) {
            if (!productDTO.getName()
                    .equals(product.getName())) {
                product.setName(productDTO.getName());
            }
        }

        if (StringUtils.hasText(productDTO.getType())) {
            if (!productDTO.getType()
                    .equals(product.getType())) {
                product.setType(productDTO.getType());
            }
        }

        if (StringUtils.hasText(productDTO.getBrand())) {
            if (!productDTO.getBrand()
                    .equals(product.getBrand())) {
                product.setBrand(productDTO.getBrand());
            }
        }

        if (StringUtils.hasText(productDTO.getCategory())) {
            if (!productDTO.getCategory()
                    .equals(product.getCategory())) {
                product.setCategory(productDTO.getCategory());
            }
        }

        if (StringUtils.hasText(productDTO.getDescription())) {
            if (!productDTO.getDescription()
                    .equals(product.getDescription())) {
                product.setDescription(productDTO.getDescription());
            }
        }

        productRepository.saveAndFlush(product);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = {"products"}, key = "#code"),
            @CacheEvict(cacheNames = {"productPage"})
    })
    public void deleteByCode(String code) {
        Product product = productRepository.findById(code)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        productRepository.delete(product);
    }

    public ProductDTO checkIfExists(String code) {
        Product product = productRepository.findById(code)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        return ProductMapper.mapToProductDTO(product);
    }
}
