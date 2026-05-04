package com.app.instagram.controller;

import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.BlockService;
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
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
@Tag(name = "Blocks", description = "Bloquer et débloquer des utilisateurs")
@SecurityRequirement(name = "bearerAuth")
public class BlockController {

    private final BlockService blockService;

    @PostMapping("/{userId}")
    @Operation(summary = "Bloquer / Débloquer un utilisateur")
    public ResponseEntity<Map<String, Object>> toggleBlock(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        boolean blocked = blockService.toggleBlock(userId, currentUser.getId());
        return ResponseEntity.ok(Map.of("blocked", blocked));
    }

    @GetMapping
    @Operation(summary = "Liste des utilisateurs bloqués")
    public ResponseEntity<List<UserResponse>> getBlockedUsers(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(blockService.getBlockedUsers(currentUser.getId()));
    }
}
