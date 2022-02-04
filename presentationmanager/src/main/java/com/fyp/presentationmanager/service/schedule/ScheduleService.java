package com.fyp.presentationmanager.service.schedule;

import com.fyp.presentationmanager.model.ScheduleModel;

import java.util.List;

public interface ScheduleService {
    ScheduleModel addOrEditSchedule(ScheduleModel scheduleModel);
    List<ScheduleModel> findSchedulesByUser();
    List<ScheduleModel> findMasterSchedules();
    ScheduleModel getSchedule(Integer id);
    Boolean deleteSchedule(Integer id);
}
