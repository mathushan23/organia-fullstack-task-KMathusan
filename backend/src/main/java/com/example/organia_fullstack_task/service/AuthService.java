package com.example.organia_fullstack_task.service;

import com.example.organia_fullstack_task.dto.AuthResponse;
import com.example.organia_fullstack_task.dto.LoginRequest;
import com.example.organia_fullstack_task.dto.SignupRequest;
import com.example.organia_fullstack_task.dto.UserResponse;
import com.example.organia_fullstack_task.model.Role;
import com.example.organia_fullstack_task.model.User;
import com.example.organia_fullstack_task.repository.UserRepository;
import com.example.organia_fullstack_task.config.JwtService;
import com.example.organia_fullstack_task.config.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = userRepository.save(new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                Role.USER
        ));

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        return toAuthResponse(user);
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(new UserPrincipal(user));
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
