package com.cheong.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private String code;

    private String name;

    private String category;

    private String brand;

    private String type;

    private String description;
}
