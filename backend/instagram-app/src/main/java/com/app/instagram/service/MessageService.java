package com.app.instagram.service;

import com.app.instagram.dto.request.MessageRequest;
import com.app.instagram.dto.response.MessageResponse;
import com.app.instagram.entity.*;
import com.app.instagram.exception.ResourceNotFoundException;
import com.app.instagram.repository.LikeRepository;
import com.app.instagram.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository ;
    private final UserService userService ;
    private final PostService postService ;
    private final CommentService commentService ;
    private final LikeRepository likeRepository ;

    public MessageResponse sendMessage(Long receiverId, MessageRequest request, Long senderId) {
        User sender = userService.findById(senderId);
        User receiver = userService.findById(receiverId);

        Message message = Message.builder()
                .content(request.getContent())
                .sender(sender)
                .receiver(receiver)
                .build();

        if (request.getSharedPostId() != null)
            message.setSharedPost(postService.findById(request.getSharedPostId()));
        if (request.getSharedCommentId() != null)
            message.setSharedComment(commentService.findById(request.getSharedCommentId()));

        return mapToMessageResponse(messageRepository.save(message), senderId);
    }

    public List<MessageResponse> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2)
                .stream().map(m -> mapToMessageResponse(m, userId1)).toList();
    }

    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message introuvable"));
        message.setRead(true);
        messageRepository.save(message);
    }

    private MessageResponse mapToMessageResponse(Message m, Long currentUserId) {
        return MessageResponse.builder()
                .id(m.getId())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .isRead(m.isRead())
                .sender(userService.mapToUserResponse(m.getSender(), currentUserId))
                .receiver(userService.mapToUserResponse(m.getReceiver(), currentUserId))
                .sharedPost(m.getSharedPost() != null ? postService.mapToPostResponse(m.getSharedPost(), currentUserId) : null)
                .likesCount(likeRepository.countByCommentId(m.getId()))
                .build();
    }

    // Injection manuelle pour éviter la dépendance circulaire
    private com.app.instagram.repository.LikeRepository likeRepository() { return likeRepository; }
}
