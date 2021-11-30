package com.fyp.presentationmanager.model.scheduleGeneticAlgo;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.util.DateTimeUtil;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Schedule {
    private List<Presentation> presentationList;
    private ScheduleData scheduleData;
    private Fitness fitness;

    public Schedule(ScheduleData scheduleData) {
        this.scheduleData = scheduleData;
        this.presentationList = new ArrayList<>(scheduleData.getClonedPresentations());
        this.fitness = new Fitness();
    }

    public Schedule init() {
        for (Presentation presentation : this.presentationList) {
            boolean panelAvailable = false;
            //check panel availability improve generation from xx-k to 500  -4k
            while (!panelAvailable) {
                Date randomStartTime = getRandomTimeFromAvailableTimeSlotAndPanelAvailability();
                Date endTime = new Date(randomStartTime.getTime() + DateTimeUtil.minutesToMillis(this.scheduleData.getPresentationDuration()));
                presentation.setStartTime(randomStartTime);
                presentation.setEndTime(endTime);
                if (presentation.calculateNumberOfPanelNotAvailable() == 0) {
                    panelAvailable = true;
                }
            }


        }
        return this;
    }

    private Date getRandomTimeFromAvailableTimeSlotAndPanelAvailability() {
        List<TimeRange> shuffledTimeSlot = new ArrayList<>(this.scheduleData.getAvailableScheduleTimeSlots());
        Collections.shuffle(shuffledTimeSlot);
        for (TimeRange timeSlot : shuffledTimeSlot) {
            Date latestStartTime = new Date(timeSlot.getEndTime().getTime() - DateTimeUtil.minutesToMillis(this.scheduleData.getPresentationDuration()));
            if (DateTimeUtil.timeAfterIncl(latestStartTime, timeSlot.getStartTime())) {
                long randomEpoch = getRandomEpochBetweenIncl(timeSlot.getStartTime(), latestStartTime);
                randomEpoch = removeSecond(randomEpoch);
                return new Date(randomEpoch);
            }

        }
        throw new RuntimeException("Invalid schedule resource. Unable to generate random time from available schedule time slot.");
    }

    private long getRandomEpochBetweenIncl(Date from, Date to) {
        return ThreadLocalRandom.current()
                .nextLong(from.getTime(),
                        (to.getTime() + DateTimeUtil.minutesToMillis(1)));
    }

    private long removeSecond(long randomMillis) {
        return randomMillis - (randomMillis % DateTimeUtil.minutesToMillis(1));
    }


    public int getNumberOfConflict() {
        return this.fitness.getFeasibilityConflict();
    }

    public List<Presentation> getPresentationList() {
        this.fitness.setChanged();
        return presentationList;
    }

    public void sortPresentation() {

//        Collections.sort(this.presentationList);
    }

    public Fitness getFitness() {
        if (this.fitness.isChanged()) {
            this.fitness.calculate(this.presentationList, this.scheduleData);
        }
        return this.fitness;
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "presentationList=" + presentationList +
                ", scheduleData=" + scheduleData +
                ", numberOfConflict=" + this.fitness.getFeasibilityConflict() +
                ", isFitnessChanged=" + this.fitness.isChanged() +
                ", fitness=" + this.fitness.ofFeasibility() +
                '}';
    }

}
