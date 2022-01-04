package com.fyp.presentationmanager.model.presentation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresentationScheduleModel {
    private Integer id;
    private Date startTime;
    private Date endTime;
    private Integer roomId;
}
