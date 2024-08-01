package com.cheong.backend.repository;

import com.cheong.backend.domain.Product;
import com.cheong.backend.dto.ProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {
}
