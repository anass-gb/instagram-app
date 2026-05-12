package com.app.instagram.service;

import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.Follow;
import com.app.instagram.entity.User;
import com.app.instagram.enums.NotificationType;
import com.app.instagram.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserService userService;
    @Lazy private final NotificationService notificationService;

    public boolean toggleFollow(Long targetUserId, Long currentUserId) {
        if (targetUserId.equals(currentUserId))
            throw new IllegalArgumentException("Vous ne pouvez pas vous suivre vous-même");

        User follower = userService.findById(currentUserId);
        User following = userService.findById(targetUserId);

        return followRepository.findByFollowerIdAndFollowingId(currentUserId, targetUserId)
                .map(f -> { followRepository.delete(f); return false; })
                .orElseGet(() -> {
                    followRepository.save(Follow.builder().follower(follower).following(following).build());
                    notificationService.createNotification(
                            following, follower, NotificationType.FOLLOW, currentUserId,
                            follower.getRealUsername() + " a commencé à vous suivre");
                    return true;
                });
    }

    public List<UserResponse> getFollowers(Long userId, Long currentUserId) {
        return followRepository.findByFollowingId(userId).stream()
                .map(f -> userService.mapToUserResponse(f.getFollower(), currentUserId))
                .toList();
    }

    public List<UserResponse> getFollowing(Long userId, Long currentUserId) {
        return followRepository.findByFollowerId(userId).stream()
                .map(f -> userService.mapToUserResponse(f.getFollowing(), currentUserId))
                .toList();
    }
}
