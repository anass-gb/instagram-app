package com.app.instagram.service;

import com.app.instagram.dto.response.PostResponse;
import com.app.instagram.entity.SavedPost;
import com.app.instagram.entity.User;
import com.app.instagram.entity.Post;
import com.app.instagram.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final UserService userService;
    private final PostService postService;

    public boolean toggleSavePost(Long postId, Long userId) {
        return savedPostRepository.findByUserIdAndPostId(userId, postId)
                .map(saved -> { savedPostRepository.delete(saved); return false; })
                .orElseGet(() -> {
                    User user = userService.findById(userId);
                    Post post = postService.findById(postId);
                    savedPostRepository.save(SavedPost.builder().user(user).post(post).build());
                    return true;
                });
    }

    public List<PostResponse> getSavedPosts(Long userId) {
        return savedPostRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(sp -> postService.mapToPostResponse(sp.getPost(), userId))
                .toList();
    }
}
