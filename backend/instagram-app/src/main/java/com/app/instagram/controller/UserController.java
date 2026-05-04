package com.app.instagram.controller;

import com.app.instagram.dto.request.UpdateProfileRequest;
import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Profil et gestion des utilisateurs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Mon profil")
    public ResponseEntity<UserResponse> getMyProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser.getId(), currentUser.getId()));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Profil d'un utilisateur")
    public ResponseEntity<UserResponse> getProfile(@PathVariable Long userId,
                                                   @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(userId, currentUser.getId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Modifier mon profil")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UpdateProfileRequest request,
                                                      @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des utilisateurs")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String q,
                                                          @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.searchUsers(q, currentUser.getId()));
    }
}
