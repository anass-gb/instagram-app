package com.app.instagram.controller;

import com.app.instagram.dto.response.PostResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.SavedPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
@Tag(name = "Saved Posts", description = "Posts sauvegardés")
@SecurityRequirement(name = "bearerAuth")
public class SavedPostController {

    private final SavedPostService savedPostService;

    @PostMapping("/{postId}")
    @Operation(summary = "Sauvegarder / Unsave un post")
    public ResponseEntity<Map<String, Object>> toggleSave(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        boolean saved = savedPostService.toggleSavePost(postId, currentUser.getId());
        return ResponseEntity.ok(Map.of("saved", saved));
    }

    @GetMapping
    @Operation(summary = "Mes posts sauvegardés")
    public ResponseEntity<List<PostResponse>> getSavedPosts(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(savedPostService.getSavedPosts(currentUser.getId()));
    }
}
