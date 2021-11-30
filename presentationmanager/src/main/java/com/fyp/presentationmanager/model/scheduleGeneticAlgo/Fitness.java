package com.fyp.presentationmanager.model.scheduleGeneticAlgo;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Panel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.ScheduleData;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.util.DateTimeUtil;

import java.util.List;

public class Fitness {
    private double feasibility = -1;
    private int feasibilityConflict = 0;
    private double objective;
    private boolean isChanged = true;

    public Fitness() {
    }

    public double ofFeasibility() {
        return feasibility;
    }

    public int getFeasibilityConflict() {
        return feasibilityConflict;
    }

    public double ofObjective() {
        return objective;
    }

    public void setObjective(double objective) {
        this.objective = objective;
    }

    public boolean isChanged() {
        return isChanged;
    }

    public void setChanged() {
        isChanged = true;
    }

    public void calculate(List<Presentation> presentationList, ScheduleData scheduleData) {
        this.feasibilityConflict = this.calculateConflicts(presentationList, scheduleData);
        this.feasibility = 1 / (Math.pow(this.feasibilityConflict, 2) * 0.01 + 1);
        this.isChanged = false;
    }

    private int calculateConflicts(List<Presentation> presentationList, ScheduleData scheduleData) {
        int numberOfConflict = 0;
        for (Presentation presentation1 : presentationList) {
            numberOfConflict += presentation1.calculateNumberOfPanelNotAvailable();
            if (!presentationIsBetweenAvailableTimeSlots(presentation1, scheduleData)) {
                numberOfConflict++;
            }
//            for (Panel panel1 : presentation1.getPanelList()) {
//                if (!panel1.isAvailableOnTimeRange(presentation1.getStartTime(), presentation1.getEndTime())) {
//                    this.numberOfConflict++;
//                }
//            }
            for (Presentation presentation2 : presentationList) {
                if (presentation1.getId() != presentation2.getId()) {
                    //conflict with other presentation
//                    if (DateTimeUtil.timeRangesOverlapped(
//                            presentation1.getStartTime(), presentation1.getEndTime(),
//                            presentation2.getStartTime(), presentation2.getEndTime())) {
//                        this.numberOfConflict++;
//                    }
                    //same panel schedule in different presentation at the same time
                    for (Panel panel2 : presentation2.getPanelList()) {
                        if (presentation1.hasPanel(panel2)
                                && DateTimeUtil.timeRangesOverlapped(
                                presentation1.getStartTime(), presentation1.getEndTime(),
                                presentation2.getStartTime(), presentation2.getEndTime())) {
                            numberOfConflict++;
                        }
                    }
                }

            }
        }
        return numberOfConflict;
    }

    private double calculateObjective(List<Presentation> presentationList, ScheduleData scheduleData) {
//        for (Presentation presentation1 : presentationList) {
//            numberOfConflict += presentation1.calculateNumberOfPanelNotAvailable();
//            if (!presentationIsBetweenAvailableTimeSlots(presentation1, scheduleData)) {
//                numberOfConflict++;
//            }
////            for (Panel panel1 : presentation1.getPanelList()) {
////                if (!panel1.isAvailableOnTimeRange(presentation1.getStartTime(), presentation1.getEndTime())) {
////                    this.numberOfConflict++;
////                }
////            }
//            for (Presentation presentation2 : presentationList) {
//                if (presentation1.getId() != presentation2.getId()) {
//                    //conflict with other presentation
////                    if (DateTimeUtil.timeRangesOverlapped(
////                            presentation1.getStartTime(), presentation1.getEndTime(),
////                            presentation2.getStartTime(), presentation2.getEndTime())) {
////                        this.numberOfConflict++;
////                    }
//                    //same panel schedule in different presentation at the same time
//                    for (Panel panel2 : presentation2.getPanelList()) {
//                        if (presentation1.hasPanel(panel2)
//                                && DateTimeUtil.timeRangesOverlapped(
//                                presentation1.getStartTime(), presentation1.getEndTime(),
//                                presentation2.getStartTime(), presentation2.getEndTime())) {
//                            numberOfConflict++;
//                        }
//                    }
//                }
//
//            }
//        }
        return 0;
    }

    public boolean presentationIsBetweenAvailableTimeSlots(Presentation presentation, ScheduleData scheduleData) {
        for (TimeRange availableScheduleTimeSlot : scheduleData.getAvailableScheduleTimeSlots()) {
            if (presentation.isBetweenTimeRange(availableScheduleTimeSlot)) {
                return true;
            }
        }
        return false;
    }
}
