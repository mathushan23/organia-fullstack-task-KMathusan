package com.example.organia_fullstack_task.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("/api/admin/dashboard")
    public String adminDashboard() {
        return "Admin access granted";
    }

    @GetMapping("/api/user/dashboard")
    public String userDashboard() {
        return "User access granted";
    }
}
