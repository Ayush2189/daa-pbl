package com.project.analytics;

import com.project.model.Submission;
import com.project.model.Assignment;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WeakTopicDetector {

    private final TopicAnalyzer topicAnalyzer;

    public WeakTopicDetector(TopicAnalyzer topicAnalyzer){
        this.topicAnalyzer = topicAnalyzer;
    }

    public List<String> detect(
            List<Submission> submissions,
            List<Assignment> assignments,
            double threshold){

        Map<String,Double> topicScores =
                topicAnalyzer.analyze(submissions,assignments);

        List<TopicScore> heap =
                new ArrayList<>();

        // Build heap input
        for(String topic : topicScores.keySet()){

            heap.add(
                    new TopicScore(
                            topic,
                            topicScores.get(topic)
                    )
            );
        }

        // Build Min Heap
        buildMinHeap(heap);

        List<String> weakTopics =
                new ArrayList<>();

        int heapSize = heap.size();

        // Extract weakest topics first
        while(heapSize > 0){

            TopicScore weakest =
                    heap.get(0);

            if(weakest.score >= threshold)
                break;

            weakTopics.add(weakest.topic);

            Collections.swap(heap,0,heapSize-1);

            heapSize--;

            heapify(heap,0,heapSize);
        }

        return weakTopics;
    }

    // =========================
    // MIN HEAP ALGORITHMS
    // =========================

    private void buildMinHeap(
            List<TopicScore> arr){

        int n = arr.size();

        for(int i=n/2-1;i>=0;i--){
            heapify(arr,i,n);
        }
    }

    private void heapify(
            List<TopicScore> arr,
            int index,
            int heapSize){

        int smallest = index;

        int left = 2*index+1;
        int right = 2*index+2;

        if(left < heapSize &&
                arr.get(left).score <
                arr.get(smallest).score){

            smallest = left;
        }

        if(right < heapSize &&
                arr.get(right).score <
                arr.get(smallest).score){

            smallest = right;
        }

        if(smallest != index){

            Collections.swap(arr,index,smallest);

            heapify(arr,smallest,heapSize);
        }
    }

    // Helper structure
    static class TopicScore{

        String topic;
        double score;

        TopicScore(String topic,double score){
            this.topic=topic;
            this.score=score;
        }
    }

}