package com.project.controller;

import com.project.model.Assignment;
import com.project.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping
    public List<Assignment> getAllAssignments() {
        try {
            return assignmentService.getAllAssignments();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error fetching all assignments",
                    e
            );
        }
    }

    @GetMapping("/topic/{topic}")
    public List<Assignment> getByTopic(@PathVariable String topic) {
        try {
            return assignmentService.getByTopic(topic);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error fetching assignments by topic",
                    e
            );
        }
    }

    @GetMapping("/difficulty/{difficulty}")
    public List<Assignment> getByDifficulty(@PathVariable String difficulty) {
        try {
            return assignmentService.getByDifficulty(difficulty);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error fetching assignments by difficulty",
                    e
            );
        }
    }

    @GetMapping("/filter")
    public List<Assignment> getByTopicAndDifficulty(
            @RequestParam String topic,
            @RequestParam String difficulty) {
        try {
            return assignmentService.getByTopicAndDifficulty(topic, difficulty);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error filtering assignments",
                    e
            );
        }
    }

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        try {
            return assignmentService.createAssignment(assignment);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error creating assignment",
                    e
            );
        }
    }
}