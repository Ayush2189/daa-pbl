package com.project.analytics;

import com.project.model.Submission;
import com.project.model.Assignment;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsEngine {

    private final PerformanceAnalyzer performanceAnalyzer;
    private final TopicAnalyzer topicAnalyzer;
    private final WeakTopicDetector weakTopicDetector;
    private final RankingEngine rankingEngine;

    public AnalyticsEngine(
            PerformanceAnalyzer performanceAnalyzer,
            TopicAnalyzer topicAnalyzer,
            WeakTopicDetector weakTopicDetector,
            RankingEngine rankingEngine
    ) {
        this.performanceAnalyzer = performanceAnalyzer;
        this.topicAnalyzer = topicAnalyzer;
        this.weakTopicDetector = weakTopicDetector;
        this.rankingEngine = rankingEngine;
    }

    public double analyzePerformance(List<Submission> submissions) {
        return performanceAnalyzer.analyze(submissions);
    }

    public Map<String, Double> analyzeTopics(
            List<Submission> submissions,
            List<Assignment> assignments) {

        return topicAnalyzer.analyze(submissions, assignments);
    }

    public List<String> detectWeakTopics(
            List<Submission> submissions,
            List<Assignment> assignments,
            double threshold) {

        return weakTopicDetector.detect(submissions, assignments, threshold);
    }

    public Map<Long, Double> rankStudents(
            Map<Long, List<Submission>> studentSubmissions) {

        return rankingEngine.rank(studentSubmissions);
    }
}