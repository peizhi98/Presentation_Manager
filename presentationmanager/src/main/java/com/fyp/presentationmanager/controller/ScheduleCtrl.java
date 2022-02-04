package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.ScheduleModel;
import com.fyp.presentationmanager.service.schedule.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleCtrl {
    @Autowired
    private ScheduleService scheduleService;

    @PostMapping(value = "/add-edit")
    private ResponseModel<ScheduleModel> addOrEditSchedule(@RequestBody ScheduleModel scheduleModel) {
        ResponseModel<ScheduleModel> responseModel = new ResponseModel();
        try {
            responseModel.success(this.scheduleService.addOrEditSchedule(scheduleModel));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "get-schedules")
    public ResponseModel<List<ScheduleModel>> getSchedules() {
        ResponseModel<List<ScheduleModel>> response = new ResponseModel<>();
        try {
            response.success(scheduleService.findSchedulesByUser());
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }

        return response;
    }

    @GetMapping(value = "get-master")
    public ResponseModel<List<ScheduleModel>> getMasterSchedules() {
        ResponseModel<List<ScheduleModel>> response = new ResponseModel<>();
        try {
            response.success(scheduleService.findMasterSchedules());
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }

        return response;
    }

    @GetMapping(value = "get-schedule")
    public ResponseModel<ScheduleModel> getSchedule(@RequestParam Integer id) {
        ResponseModel<ScheduleModel> response = new ResponseModel<>();
        try {
            response.success(this.scheduleService.getSchedule(id));
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }

        return response;
    }

    @DeleteMapping(value = "delete-schedule")
    public ResponseModel<Boolean> deleteSchedule(@RequestParam Integer id) {
        ResponseModel<Boolean> response = new ResponseModel<>();
        try {
            response.success(this.scheduleService.deleteSchedule(id));
        } catch (Exception e) {
            e.printStackTrace();
            response.failed();
        }
        return response;
    }

}
