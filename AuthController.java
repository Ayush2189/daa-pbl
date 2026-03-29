package com.project.controller;

import com.project.dto.LoginRequest;
import com.project.model.Student;
import com.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // allow requests from any frontend
public class AuthController {

    @Autowired
    private AuthService authService;

    // Login API
    @PostMapping("/login")
    public Student login(@RequestBody LoginRequest request) {
        try {
            Student student = authService.login(request);

            if (student != null) {
                return student; // success
            } else {
                return null; // invalid credentials
            }

        } catch (Exception e) {
            System.out.println("Error in controller: " + e.getMessage());
            return null;
        }
    }
}