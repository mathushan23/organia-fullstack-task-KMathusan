package com.example.organia_fullstack_task.dto;

import java.time.LocalDate;

public record AdminTaskResponse(
        Long id,
        String title,
        String description,
        String status,
        LocalDate dueDate,
        Long userId,
        String userName,
        String userEmail
) {
}
