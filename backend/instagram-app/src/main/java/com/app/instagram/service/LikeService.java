package com.app.instagram.service;

import com.app.instagram.entity.*;
import com.app.instagram.enums.NotificationType;
import com.app.instagram.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserService userService;
    private final PostService postService;
    private final CommentService commentService;
    private final StoryService storyService;

    @Lazy
    private final NotificationService notificationService;

    // ── Like / Unlike Post ─────────────────────────────────────────────────
    public boolean togglePostLike(Long postId, Long userId) {
        User user = userService.findById(userId);
        Post post = postService.findById(postId);

        return likeRepository.findByUserIdAndPostId(userId, postId)
                .map(like -> {
                    likeRepository.delete(like);
                    return false;
                })
                .orElseGet(() -> {
                    likeRepository.save(
                            Like.builder()
                                    .user(user)
                                    .post(post)
                                    .build()
                    );

                    if (!post.getUser().getId().equals(userId)) {
                        notificationService.createNotification(
                                post.getUser(),
                                user,
                                NotificationType.LIKE_POST,
                                postId,
                                user.getRealUsername() + " a aimé votre post"
                        );
                    }

                    return true;
                });
    }

    // ── Like / Unlike Comment ──────────────────────────────────────────────
    public boolean toggleCommentLike(Long commentId, Long userId) {
        User user = userService.findById(userId);
        Comment comment = commentService.findById(commentId);

        return likeRepository.findByUserIdAndCommentId(userId, commentId)
                .map(like -> {
                    likeRepository.delete(like);
                    return false;
                })
                .orElseGet(() -> {
                    likeRepository.save(
                            Like.builder()
                                    .user(user)
                                    .comment(comment)
                                    .build()
                    );

                    if (!comment.getUser().getId().equals(userId)) {
                        notificationService.createNotification(
                                comment.getUser(),
                                user,
                                NotificationType.LIKE_COMMENT,
                                commentId,
                                user.getRealUsername() + " a aimé votre commentaire"
                        );
                    }
                    return true;
                });
    }

    // ── Like / Unlike Story ────────────────────────────────────────────────
    public boolean toggleStoryLike(Long storyId, Long userId) {
        User user = userService.findById(userId);
        Story story = storyService.findById(storyId);

        return likeRepository.findByUserIdAndStoryId(userId, storyId)
                .map(like -> {
                    likeRepository.delete(like);
                    return false;
                })
                .orElseGet(() -> {

                    likeRepository.save(
                            Like.builder()
                                    .user(user)
                                    .story(story)
                                    .build()
                    );

                    if (!story.getUser().getId().equals(userId)) {
                        notificationService.createNotification(
                                story.getUser(),
                                user,
                                NotificationType.LIKE_STORY,
                                storyId,
                                user.getRealUsername() + " a 	 votre story"
                        );
                    }

                    return true;
                });
    }

    // ── Like / Unlike Message ──────────────────────────────────────────────
    public boolean toggleMessageLike(Long messageId, Long userId) {
        User user = userService.findById(userId);

        return likeRepository.findByUserIdAndMessageId(userId, messageId)
                .map(like -> {
                    likeRepository.delete(like);
                    return false;
                })
                .orElseGet(() -> {

                    likeRepository.save(
                            Like.builder()
                                    .user(user)
                                    .build()
                    );

                    return true;
                });
    }
}