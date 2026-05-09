package com.example.organia_fullstack_task.dto;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email,
        String role
) {
}
