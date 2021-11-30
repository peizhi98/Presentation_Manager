package com.fyp.presentationmanager.model.google;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CalendarEventModel {
    private Date startTime;
    private Date endTime;

}
