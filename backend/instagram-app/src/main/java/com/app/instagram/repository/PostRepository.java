package com.app.instagram.repository;

import com.app.instagram.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Feed : posts des users suivis
    @Query("""
        SELECT p FROM Post p
        WHERE p.user.id IN (
            SELECT f.following.id FROM Follow f WHERE f.follower.id = :userId
        )
        ORDER BY p.createdAt DESC
    """)
    Page<Post> findFeedForUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.caption LIKE %:q%")
    List<Post> searchPosts(@Param("q") String query);
}
