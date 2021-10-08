package com.fyp.presentationmanager.model.scheduleGeneticAlgo;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Panel;
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
    private int numberOfConflict = 0;
    private boolean isFitnessChanged = true;
    private double fitness = -1;

    public Schedule(ScheduleData scheduleData) {
        this.scheduleData = scheduleData;
        this.presentationList = new ArrayList<>(scheduleData.getClonedPresentations());
    }

    public Schedule init() {
        for (Presentation presentation : this.presentationList) {
            Date randomStartTime = getRandomTimeFromAvailableTimeSlot();
            Date endTime = new Date(randomStartTime.getTime() + DateTimeUtil.minutesToMillis(this.scheduleData.getPresentationDuration()));
            presentation.setStartTime(randomStartTime);
            presentation.setEndTime(endTime);
        }
        return this;
    }

    private Date getRandomTimeFromAvailableTimeSlot() {
        List<TimeRange> shuffledTimeSlot = new ArrayList<>(this.scheduleData.getAvailableScheduleTimeSlots());
        Collections.shuffle(shuffledTimeSlot);
        for (TimeRange timeSlot : shuffledTimeSlot) {
            Date latestStartTime = new Date(timeSlot.getEndTime().getTime() - DateTimeUtil.minutesToMillis(this.scheduleData.getPresentationDuration()));
            if (latestStartTime.after(timeSlot.getStartTime())
                    || latestStartTime.compareTo(timeSlot.getStartTime()) == 0) {
                long randomMillis = ThreadLocalRandom.current()
                        .nextLong(timeSlot.getStartTime().getTime(), (latestStartTime.getTime() + DateTimeUtil.minutesToMillis(1)));
                randomMillis = randomMillis - (randomMillis % DateTimeUtil.minutesToMillis(1));
//                if (Math.random() > 0) {
//                    randomMillis = randomMillis - (randomMillis % (DateTimeUtil.hoursToMillis(1) / 12));
//                }
                return new Date(randomMillis);
            }

        }
        throw new RuntimeException("Invalid schedule resource. Unable to generate random time from available schedule time slot.");
    }

    public int getNumberOfConflict() {
        return numberOfConflict;
    }

    public List<Presentation> getPresentationList() {
        this.isFitnessChanged = true;
        return presentationList;
    }

    public double getFitness() {
        if (this.isFitnessChanged) {
            fitness = this.calculateFitness();
            this.isFitnessChanged = false;
        }
        return fitness;
    }

    public double calculateFitness() {
        return 1 / (Math.pow(this.calculateConflicts(), 2) * 0.01 + 1);
    }

    public int calculateConflicts() {
        this.numberOfConflict = 0;
        for (Presentation presentation1 : this.presentationList) {
            this.numberOfConflict += presentation1.calculatePanelAvailableTimeConflict();
            if (!presentationIsBetweenAvailableTimeSlots(presentation1)) {
                this.numberOfConflict++;
            }
//            for (Panel panel1 : presentation1.getPanelList()) {
//                if (!panel1.isAvailableOnTimeRange(presentation1.getStartTime(), presentation1.getEndTime())) {
//                    this.numberOfConflict++;
//                }
//            }
            for (Presentation presentation2 : this.presentationList) {
                if (presentation1.getId() != presentation2.getId()) {
                    //conflict with other presentation
//                    if (DateTimeUtil.timeRangesOverlapped(
//                            presentation1.getStartTime(), presentation1.getEndTime(),
//                            presentation2.getStartTime(), presentation2.getEndTime())) {
//                        this.numberOfConflict++;
//                    }
                    //same panel schedule in different presentation at the same time
                    for (Panel panel2 : presentation2.getPanelList()) {
//                        presentation1.setStartTime(new Date(2021, 1, 31, 0, 0));
//                        presentation1.setEndTime(new Date(2021, 1, 31, 1, 0));
//                        presentation2.setStartTime(new Date(2021, 1, 31, 1, 0));
//                        presentation2.setEndTime(new Date(2021, 1, 31, 1, 30));
                        if (presentation1.hasPanel(panel2)
                                && DateTimeUtil.timeRangesOverlapped(
                                presentation1.getStartTime(), presentation1.getEndTime(),
                                presentation2.getStartTime(), presentation2.getEndTime())) {
                            this.numberOfConflict++;
                        }
                    }
                }

            }
        }
        return this.numberOfConflict;
    }

    public boolean presentationIsBetweenAvailableTimeSlots(Presentation presentation) {
        for (TimeRange availableScheduleTimeSlot : scheduleData.getAvailableScheduleTimeSlots()) {
            if (presentation.isBetweenTimeRange(availableScheduleTimeSlot)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "presentationList=" + presentationList +
                ", scheduleData=" + scheduleData +
                ", numberOfConflict=" + numberOfConflict +
                ", isFitnessChanged=" + isFitnessChanged +
                ", fitness=" + fitness +
                '}';
    }
}
