package com.example.organia_fullstack_task.controller;

import com.example.organia_fullstack_task.config.UserPrincipal;
import com.example.organia_fullstack_task.dto.AdminTaskRequest;
import com.example.organia_fullstack_task.dto.AdminTaskResponse;
import com.example.organia_fullstack_task.dto.AdminUserRequest;
import com.example.organia_fullstack_task.dto.UserResponse;
import com.example.organia_fullstack_task.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUserRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        adminService.deleteUser(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<AdminTaskResponse>> getTasks() {
        return ResponseEntity.ok(adminService.getTasks());
    }

    @PostMapping("/tasks")
    public ResponseEntity<AdminTaskResponse> createTask(@Valid @RequestBody AdminTaskRequest request) {
        return ResponseEntity.ok(adminService.createTask(request));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<AdminTaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody AdminTaskRequest request
    ) {
        return ResponseEntity.ok(adminService.updateTask(id, request));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        adminService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
