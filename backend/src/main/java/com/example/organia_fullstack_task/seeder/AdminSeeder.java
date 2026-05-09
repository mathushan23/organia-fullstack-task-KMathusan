package com.example.organia_fullstack_task.seeder;

import com.example.organia_fullstack_task.model.Role;
import com.example.organia_fullstack_task.model.User;
import com.example.organia_fullstack_task.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String ADMIN_PASSWORD = "Admin@12345";

    public AdminSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String email = ADMIN_EMAIL.trim().toLowerCase();

        if (!userRepository.existsByEmail(email)) {
            userRepository.save(new User(
                    "Admin",
                    email,
                    passwordEncoder.encode(ADMIN_PASSWORD),
                    Role.ADMIN
            ));
        }
    }
}
