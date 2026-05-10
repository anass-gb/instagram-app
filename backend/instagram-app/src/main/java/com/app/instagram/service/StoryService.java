package com.app.instagram.service;

import com.app.instagram.dto.response.StoryResponse;
import com.app.instagram.entity.*;
import com.app.instagram.exception.ResourceNotFoundException;
import com.app.instagram.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository ;
    private final StoryViewRepository storyViewRepository ;
    private final UserService userService ;
    private final PostService postService ;

    public StoryResponse createStory(String mediaUrl, Long userId, Long recipientId, Long sharedPostId) {
        User user = userService.findById(userId);
        Story story = Story.builder()
                .mediaUrl(mediaUrl)
                .user(user)
                .build();

        if (recipientId != null) story.setRecipient(userService.findById(recipientId));
        if (sharedPostId != null) story.setSharedPost(postService.findById(sharedPostId));

        return mapToStoryResponse(storyRepository.save(story), userId);
    }

    public List<StoryResponse> getFeedStories(Long userId) {
        return storyRepository.findActiveStoriesForFeed(userId, LocalDateTime.now())
                .stream().map(s -> mapToStoryResponse(s, userId)).toList();
    }

    public List<StoryResponse> getUserStories(Long userId, Long currentUserId) {
        return storyRepository.findActiveStoriesByUserId(userId, LocalDateTime.now())
                .stream().map(s -> mapToStoryResponse(s, currentUserId)).toList();
    }

    public void viewStory(Long storyId, Long viewerId) {
        if (!storyViewRepository.existsByStoryIdAndViewerId(storyId, viewerId)) {
            Story story = storyRepository.findById(storyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Story introuvable"));
            User viewer = userService.findById(viewerId);
            storyViewRepository.save(StoryView.builder().story(story).viewer(viewer).build());
        }
    }

    private StoryResponse mapToStoryResponse(Story story, Long currentUserId) {
        return StoryResponse.builder()
                .id(story.getId())
                .mediaUrl(story.getMediaUrl())
                .createdAt(story.getCreatedAt())
                .expirationTime(story.getExpirationTime())
                .user(userService.mapToUserResponse(story.getUser(), currentUserId))
                .viewsCount(storyViewRepository.countByStoryId(story.getId()))
                .isViewed(storyViewRepository.existsByStoryIdAndViewerId(story.getId(), currentUserId))
                .build();
    }
    
    public Story findById(Long id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story introuvable"));
    }
}
