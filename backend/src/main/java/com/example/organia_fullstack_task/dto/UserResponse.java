package com.example.organia_fullstack_task.dto;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {
}
