package com.app.instagram.service;

import com.app.instagram.dto.request.PostRequest;
import com.app.instagram.dto.response.PostResponse;
import com.app.instagram.entity.Post;
import com.app.instagram.entity.User;
import com.app.instagram.exception.ResourceNotFoundException;
import com.app.instagram.exception.UnauthorizedException;
import com.app.instagram.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository ;
    private final LikeRepository likeRepository ;
    private final SavedPostRepository savedPostRepository ;
    private final CommentRepository commentRepository ;
    private final UserService userService ;

    public PostResponse createPost(PostRequest request, Long userId) {
        User user = userService.findById(userId);
        Post post = Post.builder()
                .mediaUrl(request.getMediaUrl())
                .caption(request.getCaption())
                .user(user)
                .build();
        return mapToPostResponse(postRepository.save(post), userId);
    }

    public PostResponse getPost(Long postId, Long currentUserId) {
        return mapToPostResponse(findById(postId), currentUserId);
    }

    public Page<PostResponse> getFeed(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findFeedForUser(userId, pageable)
                .map(p -> mapToPostResponse(p, userId));
    }

    public Page<PostResponse> getUserPosts(Long userId, Long currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(p -> mapToPostResponse(p, currentUserId));
    }

    public List<PostResponse> searchPosts(String query, Long currentUserId) {
        return postRepository.searchPosts(query).stream()
                .map(p -> mapToPostResponse(p, currentUserId))
                .toList();
    }

    public void deletePost(Long postId, Long userId) {
        Post post = findById(postId);
        if (!post.getUser().getId().equals(userId))
            throw new UnauthorizedException("Vous ne pouvez pas supprimer ce post");
        postRepository.delete(post);
    }

    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post introuvable"));
    }

    public PostResponse mapToPostResponse(Post post, Long currentUserId) {
        return PostResponse.builder()
                .id(post.getId())
                .caption(post.getCaption())
                .mediaUrl(post.getMediaUrl())
                .createdAt(post.getCreatedAt())
                .user(userService.mapToUserResponse(post.getUser(), currentUserId))
                .likesCount(likeRepository.countByPostId(post.getId()))
                .commentsCount(commentRepository.countByPostId(post.getId()))
                .isLiked(currentUserId != null &&
                        likeRepository.existsByUserIdAndPostId(currentUserId, post.getId()))
                .isSaved(currentUserId != null &&
                        savedPostRepository.existsByUserIdAndPostId(currentUserId, post.getId()))
                .build();
    }
}
