package com.app.instagram.repository;

import com.app.instagram.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);
    Optional<Like> findByUserIdAndCommentId(Long userId, Long commentId);
    Optional<Like> findByUserIdAndMessageId(Long userId, Long messageId);
    Optional<Like> findByUserIdAndStoryId(Long userId, Long storyId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);
    long countByPostId(Long postId);
    long countByCommentId(Long commentId);
}
