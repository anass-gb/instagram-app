package com.app.instagram.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Le texte du commentaire est obligatoire")
    private String text;
    private Long parentCommentId; // null = commentaire racine
}
