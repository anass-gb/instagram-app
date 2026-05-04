package com.app.instagram.controller;

import com.app.instagram.dto.request.MessageRequest;
import com.app.instagram.dto.response.MessageResponse;
import com.app.instagram.entity.User;
import com.app.instagram.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Messagerie directe")
@SecurityRequirement(name = "bearerAuth")
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{receiverId}")
    @Operation(summary = "Envoyer un message (peut contenir un post ou commentaire partagé)")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long receiverId,
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(receiverId, request, currentUser.getId()));
    }

    @GetMapping("/conversation/{userId}")
    @Operation(summary = "Conversation entre moi et un utilisateur")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(messageService.getConversation(currentUser.getId(), userId));
    }

    @PatchMapping("/{messageId}/read")
    @Operation(summary = "Marquer un message comme lu")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal User currentUser) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }
}
