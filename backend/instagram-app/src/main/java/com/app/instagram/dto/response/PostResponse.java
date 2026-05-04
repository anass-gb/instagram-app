package com.app.instagram.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class PostResponse {
    private Long id;
    private String caption;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private UserResponse user;
    private long likesCount;
    private long commentsCount;
    private boolean isLiked;
    private boolean isSaved;
}
