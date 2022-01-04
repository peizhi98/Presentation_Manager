package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class ScheduleData {
    private List<TimeRange> availableScheduleTimeSlots;
    private List<Presentation> presentations;
    private int presentationDuration;
    private int gapTimeBetweenPresentation;

    public ScheduleData() {
        this.initTestData();
    }

    private void initTestData() {
        availableScheduleTimeSlots = new ArrayList<>();
        presentationDuration = 15;

        TimeRange timeRange = new TimeRange(new Date(2021, 1, 1, 9, 0),
                new Date(2021, 1, 1, 10, 0));
        availableScheduleTimeSlots.add(timeRange);
        timeRange = new TimeRange(new Date(2021, 1, 1, 12, 0),
                new Date(2021, 1, 1, 13, 0));
        availableScheduleTimeSlots.add(timeRange);
//        timeRange = new TimeRange(new Date(2021, 1, 1, 14, 0),
//                new Date(2021, 1, 1, 15, 0));
//        availableScheduleTimeSlots.add(timeRange);


        List<TimeRange> panelAvailableTime = new ArrayList<>();
        timeRange = new TimeRange(new Date(2021, 1, 1, 12, 0),
                new Date(2021, 1, 1, 13, 0));
        panelAvailableTime.add(timeRange);
        Panel panel = new Panel(1, panelAvailableTime);
//
//        List<TimeRange> panelAvailableTime2 = new ArrayList<>();
//        timeRange = new TimeRange(new Date(2021, 1, 1, 12, 30),
//                new Date(2021, 1, 1, 13, 0));
//        panelAvailableTime2.add(timeRange);
        Panel panel2 = new Panel(2, panelAvailableTime);

        List<Panel> panels = new ArrayList<>();
        panels.add(panel);
        panels.add(panel2);

        presentations = new ArrayList<>();
        Presentation presentation = new Presentation(1, panels);
        Presentation presentation2 = new Presentation(2, panels);
        Presentation presentation3 = new Presentation(3, panels);
        Presentation presentation4 = new Presentation(4, panels);
        presentations.add(presentation);
        presentations.add(presentation2);
        presentations.add(presentation3);
        presentations.add(presentation4);
    }

    public List<Presentation> getClonedPresentations() {
        List<Presentation> cloned = new ArrayList<>();
        for (Presentation presentation : this.presentations) {
            cloned.add((Presentation) presentation.clone());
        }
        return cloned;
    }
}
