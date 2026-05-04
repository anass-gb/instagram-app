package com.app.instagram.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String profilePicture;
    private LocalDateTime createdAt;
    private long followersCount;
    private long followingCount;
    private boolean isFollowing;
    private boolean isBlocked;
}
