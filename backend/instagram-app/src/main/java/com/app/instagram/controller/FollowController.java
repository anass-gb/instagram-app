package com.app.instagram.controller;

import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.FollowService;
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
@RequestMapping("/api/follow")
@RequiredArgsConstructor
@Tag(name = "Follow", description = "Suivre et ne plus suivre des utilisateurs")
@SecurityRequirement(name = "bearerAuth")
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}")
    @Operation(summary = "Follow / Unfollow un utilisateur")
    public ResponseEntity<Map<String, Object>> toggleFollow(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        boolean following = followService.toggleFollow(userId, currentUser.getId());
        return ResponseEntity.ok(Map.of("following", following));
    }

    @GetMapping("/{userId}/followers")
    @Operation(summary = "Liste des abonnés")
    public ResponseEntity<List<UserResponse>> getFollowers(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(followService.getFollowers(userId, currentUser.getId()));
    }

    @GetMapping("/{userId}/following")
    @Operation(summary = "Liste des abonnements")
    public ResponseEntity<List<UserResponse>> getFollowing(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(followService.getFollowing(userId, currentUser.getId()));
    }
}
