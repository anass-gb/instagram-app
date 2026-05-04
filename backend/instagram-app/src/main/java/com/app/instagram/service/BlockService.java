package com.app.instagram.service;

import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.Block;
import com.app.instagram.entity.User;
import com.app.instagram.repository.BlockRepository;
import com.app.instagram.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockRepository blockRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    public boolean toggleBlock(Long targetUserId, Long currentUserId) {
        if (targetUserId.equals(currentUserId))
            throw new IllegalArgumentException("Vous ne pouvez pas vous bloquer vous-même");

        return blockRepository.findByBlockerIdAndBlockedId(currentUserId, targetUserId)
                .map(block -> { blockRepository.delete(block); return false; })
                .orElseGet(() -> {
                    User blocker = userService.findById(currentUserId);
                    User blocked = userService.findById(targetUserId);

                    // Supprimer le follow dans les deux sens s'il existe
                    followRepository.findByFollowerIdAndFollowingId(currentUserId, targetUserId)
                            .ifPresent(followRepository::delete);
                    followRepository.findByFollowerIdAndFollowingId(targetUserId, currentUserId)
                            .ifPresent(followRepository::delete);

                    blockRepository.save(Block.builder().blocker(blocker).blocked(blocked).build());
                    return true;
                });
    }

    public List<UserResponse> getBlockedUsers(Long userId) {
        return blockRepository.findByBlockerId(userId)
                .stream()
                .map(b -> userService.mapToUserResponse(b.getBlocked(), userId))
                .toList();
    }

    public boolean isBlocked(Long blockerId, Long blockedId) {
        return blockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId);
    }
}
