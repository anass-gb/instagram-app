package com.app.instagram.controller;

import com.app.instagram.dto.request.PostRequest;
import com.app.instagram.dto.response.PostResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Publications Instagram")
@SecurityRequirement(name = "bearerAuth")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "Créer un post")
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request,
                                                   @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(request, currentUser.getId()));
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Voir un post")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId,
                                                @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.getPost(postId, currentUser.getId()));
    }

    @GetMapping("/feed")
    @Operation(summary = "Feed (posts des personnes suivies)")
    public ResponseEntity<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.getFeed(currentUser.getId(), page, size));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Posts d'un utilisateur")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.getUserPosts(userId, currentUser.getId(), page, size));
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Supprimer un post")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId,
                                           @AuthenticationPrincipal User currentUser) {
        postService.deletePost(postId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
