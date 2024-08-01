package com.cheong.backend.api;

import com.cheong.backend.dto.ProductDTO;
import com.cheong.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductApi {

    private final ProductService productService;

    public ProductApi(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public HttpEntity<Page<ProductDTO>> findAll(Pageable pageable){
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{code}")
    public HttpEntity<ProductDTO> findByCode(@PathVariable String code){
        return ResponseEntity.ok(productService.findByCode(code));
    }

    @GetMapping("/{code}/checkIfExists")
    public HttpEntity<ProductDTO> checkProductExistByCode(@PathVariable String code){
        return ResponseEntity.ok(productService.checkIfExists(code));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody ProductDTO productDTO){
        productService.save(productDTO);
    }

    @PutMapping("/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateByCode(@PathVariable String code, @RequestBody ProductDTO productDTO){
        productService.update(code, productDTO);
    }

    @DeleteMapping("/{code}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteByCode(@PathVariable String code){
        productService.deleteByCode(code);
    }
}
