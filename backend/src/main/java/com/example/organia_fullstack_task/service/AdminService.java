package com.example.organia_fullstack_task.service;

import com.example.organia_fullstack_task.dto.AdminTaskRequest;
import com.example.organia_fullstack_task.dto.AdminTaskResponse;
import com.example.organia_fullstack_task.dto.AdminUserRequest;
import com.example.organia_fullstack_task.dto.UserResponse;
import com.example.organia_fullstack_task.model.Task;
import com.example.organia_fullstack_task.model.User;
import com.example.organia_fullstack_task.repository.TaskRepository;
import com.example.organia_fullstack_task.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            UserRepository userRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse createUser(AdminUserRequest request) {
        String email = cleanEmail(request.email());

        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        if (request.password().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = userRepository.save(new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                request.role()
        ));

        return toUserResponse(user);
    }

    public UserResponse updateUser(Long id, AdminUserRequest request) {
        User user = findUser(id);
        String email = cleanEmail(request.email());

        userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        user.update(request.name().trim(), email, request.role());

        if (request.password() != null && !request.password().isBlank()) {
            if (request.password().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters");
            }
            user.updatePassword(passwordEncoder.encode(request.password()));
        }

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, User currentAdmin) {
        User user = findUser(id);

        if (user.getId().equals(currentAdmin.getId())) {
            throw new IllegalArgumentException("You cannot delete your own admin account");
        }

        taskRepository.deleteByUser(user);
        userRepository.delete(user);
    }

    public List<AdminTaskResponse> getTasks() {
        return taskRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toTaskResponse)
                .toList();
    }

    public AdminTaskResponse createTask(AdminTaskRequest request) {
        User user = findUser(request.userId());
        Task task = taskRepository.save(new Task(
                request.title().trim(),
                cleanText(request.description()),
                request.status(),
                request.dueDate(),
                user
        ));

        return toTaskResponse(task);
    }

    public AdminTaskResponse updateTask(Long id, AdminTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        User user = findUser(request.userId());

        task.update(
                request.title().trim(),
                cleanText(request.description()),
                request.status(),
                request.dueDate()
        );
        task.assignTo(user);

        return toTaskResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        taskRepository.delete(task);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    private AdminTaskResponse toTaskResponse(Task task) {
        return new AdminTaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getDueDate(),
                task.getUser().getId(),
                task.getUser().getName(),
                task.getUser().getEmail()
        );
    }

    private String cleanEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String cleanText(String value) {
        return value == null ? "" : value.trim();
    }
}
