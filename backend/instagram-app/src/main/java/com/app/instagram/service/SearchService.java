package com.app.instagram.service;

import com.app.instagram.dto.response.PostResponse;
import com.app.instagram.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserService userService ;
    private final PostService postService ;

    public Map<String, Object> search(String query, Long currentUserId) {
        List<UserResponse> users = userService.searchUsers(query, currentUserId);
        List<PostResponse> posts = postService.searchPosts(query, currentUserId);

        return Map.of(
                "users", users,
                "posts", posts,
                "totalUsers", users.size(),
                "totalPosts", posts.size()
        );
    }

    public List<UserResponse> searchUsers(String query, Long currentUserId) {
        return userService.searchUsers(query, currentUserId);
    }

    public List<PostResponse> searchPosts(String query, Long currentUserId) {
        return postService.searchPosts(query, currentUserId);
    }
}
