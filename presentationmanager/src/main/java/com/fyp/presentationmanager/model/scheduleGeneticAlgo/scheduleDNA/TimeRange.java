package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeRange {
    private Date startTime;
    private Date endTime;

}
