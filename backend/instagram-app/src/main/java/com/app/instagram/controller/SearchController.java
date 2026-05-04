package com.app.instagram.controller;

import com.app.instagram.entity.User;
import com.app.instagram.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Recherche globale : users + posts")
@SecurityRequirement(name = "bearerAuth")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "Recherche globale (users + posts)")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String q,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(searchService.search(q, currentUser.getId()));
    }

    @GetMapping("/users")
    @Operation(summary = "Rechercher uniquement des utilisateurs")
    public ResponseEntity<?> searchUsers(@RequestParam String q,
                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(searchService.searchUsers(q, currentUser.getId()));
    }

    @GetMapping("/posts")
    @Operation(summary = "Rechercher uniquement des posts")
    public ResponseEntity<?> searchPosts(@RequestParam String q,
                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(searchService.searchPosts(q, currentUser.getId()));
    }
}
