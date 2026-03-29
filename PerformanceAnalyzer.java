package com.project.analytics;

import com.project.model.Submission;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PerformanceAnalyzer {

    public double analyze(List<Submission> submissions) {

        if(submissions == null || submissions.isEmpty())
            return 0;

        List<Integer> scores = new ArrayList<>();

        for(Submission s : submissions){
            scores.add(s.getScore());
        }

        // Classical DAA algorithm
        mergeSort(scores, 0, scores.size()-1);

        return average(scores);
    }

    // Average calculation
    private double average(List<Integer> scores){

        int sum = 0;

        for(int score : scores){
            sum += score;
        }

        return (double) sum / scores.size();
    }

    // Median calculation (extra analytics)
    public double median(List<Submission> submissions){

        List<Integer> scores = new ArrayList<>();

        for(Submission s : submissions){
            scores.add(s.getScore());
        }

        mergeSort(scores,0,scores.size()-1);

        int n = scores.size();

        if(n % 2 == 0){
            return (scores.get(n/2) + scores.get(n/2 -1)) / 2.0;
        }

        return scores.get(n/2);
    }

    // ==============================
    // MERGE SORT (Divide & Conquer)
    // ==============================

    private void mergeSort(List<Integer> arr, int left, int right){

        if(left >= right)
            return;

        int mid = (left + right)/2;

        mergeSort(arr,left,mid);
        mergeSort(arr,mid+1,right);

        merge(arr,left,mid,right);
    }

    private void merge(
            List<Integer> arr,
            int left,
            int mid,
            int right){

        List<Integer> temp = new ArrayList<>();

        int i = left;
        int j = mid+1;

        while(i<=mid && j<=right){

            if(arr.get(i) <= arr.get(j)){
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