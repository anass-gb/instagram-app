package com.app.instagram.repository;

import com.app.instagram.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    @Query("SELECT s FROM Story s WHERE s.user.id = :userId AND s.expirationTime > :now")
    List<Story> findActiveStoriesByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    @Query("""
        SELECT s FROM Story s WHERE s.user.id IN (
            SELECT f.following.id FROM Follow f WHERE f.follower.id = :userId
        ) AND s.expirationTime > :now ORDER BY s.createdAt DESC
    """)
    List<Story> findActiveStoriesForFeed(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
