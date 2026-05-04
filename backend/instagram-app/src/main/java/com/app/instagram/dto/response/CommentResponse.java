package com.app.instagram.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class CommentResponse {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private UserResponse user;
    private long likesCount;
    private boolean isLiked;
    private List<CommentResponse> replies;
    private Long parentCommentId;
}
