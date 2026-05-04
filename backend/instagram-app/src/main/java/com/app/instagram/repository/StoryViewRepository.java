package com.app.instagram.repository;

import com.app.instagram.entity.StoryView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryViewRepository extends JpaRepository<StoryView, Long> {
    boolean existsByStoryIdAndViewerId(Long storyId, Long viewerId);
    long countByStoryId(Long storyId);
}
