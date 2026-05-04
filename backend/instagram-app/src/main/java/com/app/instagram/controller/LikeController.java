package com.app.instagram.controller;

import com.app.instagram.entity.User;
import com.app.instagram.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "Likes", description = "Aimer posts, commentaires et messages")
@SecurityRequirement(name = "bearerAuth")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/posts/{postId}")
    @Operation(summary = "Like / Unlike un post")
    public ResponseEntity<Map<String, Object>> togglePostLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        boolean liked = likeService.togglePostLike(postId, currentUser.getId());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @PostMapping("/comments/{commentId}")
    @Operation(summary = "Like / Unlike un commentaire")
    public ResponseEntity<Map<String, Object>> toggleCommentLike(
            @PathVariable Long commentId,
            @AuthenticationPrincipal User currentUser) {
        boolean liked = likeService.toggleCommentLike(commentId, currentUser.getId());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @PostMapping("/messages/{messageId}")
    @Operation(summary = "Like / Unlike un message")
    public ResponseEntity<Map<String, Object>> toggleMessageLike(
            @PathVariable Long messageId,
            @AuthenticationPrincipal User currentUser) {
        boolean liked = likeService.toggleMessageLike(messageId, currentUser.getId());
        return ResponseEntity.ok(Map.of("liked", liked));
    }
}
