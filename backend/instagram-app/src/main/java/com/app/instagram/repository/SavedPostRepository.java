package com.app.instagram.repository;

import com.app.instagram.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    Optional<SavedPost> findByUserIdAndPostId(Long userId, Long postId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    List<SavedPost> findByUserIdOrderBySavedAtDesc(Long userId);
}
