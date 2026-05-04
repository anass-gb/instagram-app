package com.app.instagram.service;

import com.app.instagram.dto.request.LoginRequest;
import com.app.instagram.dto.request.RegisterRequest;
import com.app.instagram.dto.response.AuthResponse;
import com.app.instagram.dto.response.UserResponse;
import com.app.instagram.entity.User;
import com.app.instagram.exception.ResourceAlreadyExistsException;
import com.app.instagram.repository.UserRepository;
import com.app.instagram.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils ;
    private final AuthenticationManager authenticationManager ;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new ResourceAlreadyExistsException("Email déjà utilisé");
        if (userRepository.existsByUsername(request.getUsername()))
            throw new ResourceAlreadyExistsException("Nom d'utilisateur déjà pris");

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        String token = jwtUtils.generateToken(user);
        return AuthResponse.of(token, mapToUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String token = jwtUtils.generateToken(user);
        return AuthResponse.of(token, mapToUserResponse(user));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
