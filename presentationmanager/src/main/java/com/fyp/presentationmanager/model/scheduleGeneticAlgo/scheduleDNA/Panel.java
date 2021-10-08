package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import com.fyp.presentationmanager.util.DateTimeUtil;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Panel {
    private Integer id;
    private List<TimeRange> AvailableTimeList = new ArrayList<>();//to-do: combine overlapped time range

    public Panel(Integer id, List<TimeRange> AvailableTimeList) {
        this.id = id;
        if (AvailableTimeList != null) {
            this.AvailableTimeList = AvailableTimeList;
        }
    }

    public boolean isAvailableOnTimeRange(Date startTime, Date endTime) {
        for (TimeRange availableTime : AvailableTimeList) {
            if (DateTimeUtil.timeRangeIsBetweenTimeRange(startTime, endTime, availableTime.getStartTime(), availableTime.getEndTime())) {
                return true;
            }
        }
        return false;
    }
}
