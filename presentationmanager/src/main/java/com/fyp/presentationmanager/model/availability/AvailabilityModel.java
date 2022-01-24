package com.fyp.presentationmanager.model.availability;

import com.fyp.presentationmanager.entity.AvailabilityBean;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AvailabilityModel {
    private Integer id;
    private Date startTime;
    private Date endTime;

    public static AvailabilityModel build(AvailabilityBean availabilityBean) {
        AvailabilityModel availabilityModel = new AvailabilityModel();
        availabilityModel.setId(availabilityBean.getId());
        availabilityModel.setEndTime(availabilityBean.getEndTime());
        availabilityModel.setStartTime(availabilityBean.getStartTime());
        return availabilityModel;
    }

    private TimeRange toTimeRange() {
        return new TimeRange(this.startTime, this.endTime);
    }
}
