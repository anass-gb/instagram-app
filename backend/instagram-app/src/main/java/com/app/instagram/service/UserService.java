package com.app.instagram.service;

import com.app.instagram.dto.request.UpdateProfileRequest;
import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.User;
import com.app.instagram.exception.ResourceNotFoundException;
import com.app.instagram.repository.BlockRepository;
import com.app.instagram.repository.FollowRepository;
import com.app.instagram.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository ;
    private final FollowRepository followRepository ;
    private final BlockRepository blockRepository ;

    public UserResponse getProfile(Long userId, Long currentUserId) {
        User user = findById(userId);
        return mapToUserResponse(user, currentUserId);
    }

    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findById(userId);
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());
        return mapToUserResponse(userRepository.save(user), userId);
    }

    public List<UserResponse> searchUsers(String query, Long currentUserId) {
        return userRepository.searchUsers(query).stream()
                .map(u -> mapToUserResponse(u, currentUserId))
                .toList();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    public UserResponse mapToUserResponse(User user, Long currentUserId) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .followersCount(followRepository.countByFollowingId(user.getId()))
                .followingCount(followRepository.countByFollowerId(user.getId()))
                .isFollowing(currentUserId != null &&
                        followRepository.existsByFollowerIdAndFollowingId(currentUserId, user.getId()))
                .isBlocked(currentUserId != null &&
                        blockRepository.existsByBlockerIdAndBlockedId(currentUserId, user.getId()))
                .build();
    }
}
