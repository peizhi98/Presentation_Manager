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
        IntStream.range(0, size).forEach(x -> {
            this.scheduleList.add(new Schedule(scheduleData).init());
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
