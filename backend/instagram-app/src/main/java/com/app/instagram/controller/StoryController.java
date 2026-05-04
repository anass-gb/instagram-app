package com.app.instagram.controller;

import com.app.instagram.dto.response.StoryResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
@Tag(name = "Stories", description = "Stories Instagram — expirent après 24h")
@SecurityRequirement(name = "bearerAuth")
public class StoryController {

    private final StoryService storyService;

    @PostMapping
    @Operation(summary = "Publier une story (mediaUrl obligatoire, recipientId et sharedPostId optionnels)")
    public ResponseEntity<StoryResponse> createStory(
            @RequestParam String mediaUrl,
            @RequestParam(required = false) Long recipientId,
            @RequestParam(required = false) Long sharedPostId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(storyService.createStory(mediaUrl, currentUser.getId(), recipientId, sharedPostId));
    }

    @GetMapping("/feed")
    @Operation(summary = "Stories du feed (personnes suivies, non expirées)")
    public ResponseEntity<List<StoryResponse>> getFeedStories(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(storyService.getFeedStories(currentUser.getId()));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Stories actives d'un utilisateur")
    public ResponseEntity<List<StoryResponse>> getUserStories(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(storyService.getUserStories(userId, currentUser.getId()));
    }

    @PostMapping("/{storyId}/view")
    @Operation(summary = "Marquer une story comme vue")
    public ResponseEntity<Void> viewStory(
            @PathVariable Long storyId,
            @AuthenticationPrincipal User currentUser) {
        storyService.viewStory(storyId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
