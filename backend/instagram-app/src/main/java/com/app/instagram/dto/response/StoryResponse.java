package com.app.instagram.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class StoryResponse {
    private Long id;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expirationTime;
    private UserResponse user;
    private long viewsCount;
    private boolean isLiked;
    private boolean isViewed;
}
