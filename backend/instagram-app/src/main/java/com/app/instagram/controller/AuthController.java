package com.app.instagram.controller;

import com.app.instagram.dto.request.LoginRequest;
import com.app.instagram.dto.request.RegisterRequest;
import com.app.instagram.dto.response.AuthResponse;
import com.app.instagram.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Sign up, Sign in, Sign out")
public class AuthController {

    private final AuthService authService ;

    @PostMapping("/signup")
    @Operation(summary = "Créer un compte")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/signin")
    @Operation(summary = "Se connecter")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/signout")
    @Operation(summary = "Se déconnecter (côté client : supprimer le token)")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Déconnexion réussie. Supprimez le token côté client.");
    }
}
