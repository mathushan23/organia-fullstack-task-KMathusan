package com.example.organia_fullstack_task.dto;

import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        LocalDate dueDate
) {
}
