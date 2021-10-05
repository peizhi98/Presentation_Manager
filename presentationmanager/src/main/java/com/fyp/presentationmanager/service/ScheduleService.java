package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.model.ScheduleModel;

import java.util.List;

public interface ScheduleService {
    ScheduleModel addOrEditSchedule(ScheduleModel scheduleModel);
    List<ScheduleModel> findSchedulesByUser();
    ScheduleModel getSchedule(Integer id);
}
