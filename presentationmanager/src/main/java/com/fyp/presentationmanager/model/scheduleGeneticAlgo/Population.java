package com.fyp.presentationmanager.model.scheduleGeneticAlgo;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

public class Population {
    private List<Schedule> scheduleList;

    public Population(int size, ScheduleData scheduleData) {
        this.scheduleList = new ArrayList<>();
//        for (int i=0;i<size;i++){
//            this.scheduleList.add(new Schedule(scheduleData).init());
//        }
        IntStream.range(0, size).forEach(x -> {
            this.scheduleList.add(new Schedule(scheduleData).init());
            //testData
//            for(int i=0;i<4;i++){
//                if(i==0){
//                    this.scheduleList.get(x).getPresentationList().get(i).setStartTime(new Date(2021, 1, 1, 12, 0));
//                    this.scheduleList.get(x).getPresentationList().get(i).setEndTime(new Date(2021, 1, 1, 12, 15));
//
//                }
//                if(i==1){
//                    this.scheduleList.get(x).getPresentationList().get(i).setStartTime(new Date(2021, 1, 1, 12, 15));
//                    this.scheduleList.get(x).getPresentationList().get(i).setEndTime(new Date(2021, 1, 1, 12, 30));
//
//                }
//                if(i==2){
//                    this.scheduleList.get(x).getPresentationList().get(i).setStartTime(new Date(2021, 1, 1, 12, 30));
//                    this.scheduleList.get(x).getPresentationList().get(i).setEndTime(new Date(2021, 1, 1, 12, 45));
//
//                }
//                if(i==3){
//                    this.scheduleList.get(x).getPresentationList().get(i).setStartTime(new Date(2021, 1, 1, 12, 45));
//                    this.scheduleList.get(x).getPresentationList().get(i).setEndTime(new Date(2021, 1, 1, 13, 0));
//
//                }
//                }
        });
    }

    //shuffle first to prevent fall into local optimum
    public Population shuffleAndSortByFitness() {
        Collections.shuffle(this.scheduleList);
        return sortByFitness();
    }

    public Population sortByFitness() {
        scheduleList.sort((schedule1, schedule2) -> {
            if (schedule1.getFitness().ofFeasibility() > schedule2.getFitness().ofFeasibility()) {
                return -1;
            } else if (schedule1.getFitness().ofFeasibility() < schedule2.getFitness().ofFeasibility()) {
                return 1;
            }
            return 0;
        });
        return this;
    }

    public List<Schedule> getScheduleList() {
        return scheduleList;
    }
}
