package com.project.controller;

import com.project.dto.AnalyticsResponse;
import com.project.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    // Combined Analytics API for student dashboard
    @GetMapping("/dashboard/{studentId}")
    public AnalyticsResponse getDashboardAnalytics(@PathVariable Long studentId,
                                                   @RequestParam(defaultValue = "60") double weakThreshold) {
        try {
            double averageScore = analyticsService.getStudentPerformance(studentId);
            var topicScores = analyticsService.getTopicAnalysis(studentId);
            var weakTopics = analyticsService.getWeakTopics(studentId, weakThreshold);
            // long activeDays = analyticsService.getConsistency(studentId);
            var ranking = analyticsService.getRanking();

            return new AnalyticsResponse(
                    studentId,
                    averageScore,
                    topicScores,
                    weakTopics,
                 
                    ranking
            );
        } catch (Exception e) {
            System.out.println("Error fetching dashboard analytics: " + e.getMessage());
            return new AnalyticsResponse(); // empty/default response
        }
    }
}