package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.google.CalendarEventModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.service.google.GoogleAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("test")
public class TestCtrl {
    @Autowired
    private GoogleAPIService googleAPIService;

    @PostMapping(value = "/test")
    public ResponseModel<String> test(@RequestBody TimeRange timeRange) {
        ResponseModel<String> responseModel = new ResponseModel<>();
        CalendarEventModel calendarEventModel=new CalendarEventModel();
        calendarEventModel.setStartTime(timeRange.getStartTime());
        calendarEventModel.setEndTime(timeRange.getEndTime());
        this.googleAPIService.addGoogleCalendarEvent(calendarEventModel);
        try {

        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }
}
