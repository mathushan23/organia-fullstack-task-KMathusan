package com.example.organia_fullstack_task.dto;

import com.example.organia_fullstack_task.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminUserRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String password,

        @NotNull(message = "Role is required")
        Role role
) {
}
