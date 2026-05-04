package com.app.instagram.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom d'utilisateur est obligatoire")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank @Email(message = "Email invalide")
    private String email;

    @NotBlank @Size(min = 6, message = "Mot de passe minimum 6 caractères")
    private String password;
}
