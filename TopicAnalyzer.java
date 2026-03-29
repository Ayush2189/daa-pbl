package com.project.analytics;

import com.project.model.Submission;
import com.project.model.Assignment;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TopicAnalyzer {

    public Map<String, Double> analyze(
            List<Submission> submissions,
            List<Assignment> assignments){

        // Hash indexing (DAA optimization)
        Map<Long, Assignment> assignmentMap =
                new HashMap<>();

        for(Assignment a : assignments){
            assignmentMap.put(a.getId(), a);
        }

        // Topic grouping
        Map<String,List<Integer>> topicScores =
                new HashMap<>();

        for(Submission s : submissions){

            Assignment a =
                    assignmentMap.get(s.getAssignmentId());

            if(a != null){

                topicScores
                        .computeIfAbsent(
                                a.getTopic(),
                                k->new ArrayList<>())
                        .add(s.getScore());
            }
        }

        // Compute averages
        Map<String,Double> result =
                new HashMap<>();

        for(String topic : topicScores.keySet()){

            List<Integer> scores =
                    topicScores.get(topic);

            double avg = average(scores);

            result.put(topic,avg);
        }

        return sortTopics(result);
    }

    // Average calculation
    private double average(List<Integer> scores){

        int sum = 0;

        for(int score : scores){
            sum += score;
        }

        return (double)sum / scores.size();
    }

    // =========================
    // MERGE SORT FOR TOPICS
    // =========================

    private Map<String,Double> sortTopics(
            Map<String,Double> map){

        List<Map.Entry<String,Double>> list =
                new ArrayList<>(map.entrySet());

        mergeSort(list,0,list.size()-1);

        Map<String,Double> sorted =
                new LinkedHashMap<>();

        for(Map.Entry<String,Double> e : list){
            sorted.put(e.getKey(),e.getValue());
        }

        return sorted;
    }

    private void mergeSort(
            List<Map.Entry<String,Double>> arr,
            int left,
            int right){

        if(left >= right)
            return;

        int mid = (left+right)/2;

        mergeSort(arr,left,mid);
        mergeSort(arr,mid+1,right);

        merge(arr,left,mid,right);
    }

    private void merge(
            List<Map.Entry<String,Double>> arr,
            int left,
            int mid,
            int right){

        List<Map.Entry<String,Double>> temp =
                new ArrayList<>();

        int i = left;
        int j = mid+1;

        while(i<=mid && j<=right){

            if(arr.get(i).getValue() >=
               arr.get(j).getValue()){

                temp.add(arr.get(i));
                i++;
            }
            else{

                temp.add(arr.get(j));
                j++;
            }
        }

        while(i<=mid){
            temp.add(arr.get(i));
            i++;
        }

        while(j<=right){
            temp.add(arr.get(j));
            j++;
        }

        for(int k=0;k<temp.size();k++){
            arr.set(left+k,temp.get(k));
        }
    }

}