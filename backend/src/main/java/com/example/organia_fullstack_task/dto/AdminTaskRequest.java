package com.example.organia_fullstack_task.dto;

import com.example.organia_fullstack_task.model.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AdminTaskRequest(
        @NotNull(message = "User is required")
        Long userId,

        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must be 100 characters or less")
        String title,

        @Size(max = 500, message = "Description must be 500 characters or less")
        String description,

        @NotNull(message = "Status is required")
        TaskStatus status,

        @NotNull(message = "Due date is required")
        @FutureOrPresent(message = "Due date cannot be in the past")
        LocalDate dueDate
) {
}
