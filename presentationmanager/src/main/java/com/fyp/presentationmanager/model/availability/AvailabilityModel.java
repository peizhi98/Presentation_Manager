package com.fyp.presentationmanager.model.availability;

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
}
