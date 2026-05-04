package com.app.instagram.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {
    @NotBlank(message = "Le contenu du message est obligatoire")
    private String content;
    private Long sharedPostId;
    private Long sharedCommentId;
}
