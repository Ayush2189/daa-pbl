package com.project.controller;

import com.project.model.Submission;
import com.project.service.SubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    // Optional manual submission (can keep)
    @PostMapping
    public Submission createSubmission(
            @RequestBody Submission submission) {

        return submissionService
                .createSubmission(submission);
    }

    // Used by history.js
    @GetMapping("/student/{studentId}")
    public List<Submission> getByStudent(
            @PathVariable Long studentId) {

        return submissionService
                .getByStudent(studentId);
    }

    // Teacher usage
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(
            @PathVariable Long assignmentId) {

        return submissionService
                .getByAssignment(assignmentId);
    }

    // Filter usage
    @GetMapping("/filter")
    public List<Submission> getByStudentAndAssignment(

            @RequestParam Long studentId,

            @RequestParam Long assignmentId) {

        return submissionService
                .getByStudentAndAssignment(
                        studentId,
                        assignmentId
                );
    }

}