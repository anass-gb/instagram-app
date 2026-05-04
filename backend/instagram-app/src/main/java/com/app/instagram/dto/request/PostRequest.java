package com.app.instagram.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {
    @NotBlank(message = "L'URL du média est obligatoire")
    private String mediaUrl;
    private String caption;
}
