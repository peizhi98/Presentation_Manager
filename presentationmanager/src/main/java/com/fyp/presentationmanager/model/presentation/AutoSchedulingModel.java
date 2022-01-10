package com.fyp.presentationmanager.model.presentation;

import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoSchedulingModel {
    private Integer scheduleId;
    private List<PresentationModel> presentationToScheduleOnline;
    private List<PresentationModel> presentationToSchedulePhysical;
    private Boolean considerAvailability;
    private List<TimeRange> timeRangesToSchedule;
    private Integer presentationDuration;
}
