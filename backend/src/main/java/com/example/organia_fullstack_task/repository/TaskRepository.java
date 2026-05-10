package com.example.organia_fullstack_task.repository;

import com.example.organia_fullstack_task.model.Task;
import com.example.organia_fullstack_task.model.TaskStatus;
import com.example.organia_fullstack_task.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByIdDesc();

    List<Task> findByUserOrderByIdDesc(User user);

    List<Task> findByUserAndStatusOrderByIdDesc(User user, TaskStatus status);

    Optional<Task> findByIdAndUser(Long id, User user);

    void deleteByUser(User user);
}
