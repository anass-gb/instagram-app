package com.app.instagram.service;

import com.app.instagram.dto.request.CommentRequest;
import com.app.instagram.dto.response.CommentResponse;
import com.app.instagram.entity.Comment;
import com.app.instagram.entity.Post;
import com.app.instagram.entity.User;
import com.app.instagram.enums.NotificationType;
import com.app.instagram.exception.ResourceNotFoundException;
import com.app.instagram.exception.UnauthorizedException;
import com.app.instagram.repository.CommentRepository;
import com.app.instagram.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository ;
    private final LikeRepository likeRepository ;
    private final UserService userService ;
    private final PostService postService ;
    private final NotificationService notificationService;

    public CommentResponse addComment(Long postId, CommentRequest request, Long userId) {
        User user = userService.findById(userId);
        Post post = postService.findById(postId);

        Comment comment = Comment.builder()
                .text(request.getText())
                .user(user)
                .post(post)
                .build();

        if (request.getParentCommentId() != null) {
            Comment parent = findById(request.getParentCommentId());
            comment.setParentComment(parent);
        }

        Comment saved = commentRepository.save(comment);

        // Notifier le propriétaire du post
        if (!post.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                    post.getUser(), user, NotificationType.COMMENT, saved.getId(),
                    user.getUsername() + " a commenté votre post");
        }

        return mapToCommentResponse(saved, userId);
    }

    public List<CommentResponse> getPostComments(Long postId, Long currentUserId) {
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtDesc(postId)
                .stream().map(c -> mapToCommentResponse(c, currentUserId)).toList();
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = findById(commentId);
        if (!comment.getUser().getId().equals(userId))
            throw new UnauthorizedException("Vous ne pouvez pas supprimer ce commentaire");
        commentRepository.delete(comment);
    }

    public Comment findById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable"));
    }

    public CommentResponse mapToCommentResponse(Comment comment, Long currentUserId) {
        List<CommentResponse> replies = commentRepository
                .findByParentCommentIdOrderByCreatedAtAsc(comment.getId())
                .stream().map(r -> mapToCommentResponse(r, currentUserId)).toList();

        return CommentResponse.builder()
                .id(comment.getId())
                .text(comment.getText())
                .createdAt(comment.getCreatedAt())
                .user(userService.mapToUserResponse(comment.getUser(), currentUserId))
                .likesCount(likeRepository.countByCommentId(comment.getId()))
                .isLiked(currentUserId != null &&
                        likeRepository.existsByUserIdAndCommentId(currentUserId, comment.getId()))
                .replies(replies)
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .build();
    }
}
