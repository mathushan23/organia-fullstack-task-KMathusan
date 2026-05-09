package com.example.organia_fullstack_task.service;

import com.example.organia_fullstack_task.dto.TaskRequest;
import com.example.organia_fullstack_task.dto.TaskResponse;
import com.example.organia_fullstack_task.model.Task;
import com.example.organia_fullstack_task.model.TaskStatus;
import com.example.organia_fullstack_task.model.User;
import com.example.organia_fullstack_task.repository.TaskRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponse> getTasks(User user, TaskStatus status) {
        List<Task> tasks = status == null
                ? taskRepository.findByUserOrderByIdDesc(user)
                : taskRepository.findByUserAndStatusOrderByIdDesc(user, status);

        return tasks.stream().map(this::toResponse).toList();
    }

    public TaskResponse createTask(User user, TaskRequest request) {
        Task task = taskRepository.save(new Task(
                request.title().trim(),
                cleanText(request.description()),
                request.status(),
                request.dueDate(),
                user
        ));

        return toResponse(task);
    }

    public TaskResponse updateTask(User user, Long id, TaskRequest request) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        task.update(
                request.title().trim(),
                cleanText(request.description()),
                request.status(),
                request.dueDate()
        );

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(User user, Long id) {
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getDueDate()
        );
    }

    private String cleanText(String value) {
        return value == null ? "" : value.trim();
    }
}
