package com.app.instagram.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class MessageResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private boolean isRead;
    private UserResponse sender;
    private UserResponse receiver;
    private PostResponse sharedPost;
    private long likesCount;
    private boolean isLiked;
}
