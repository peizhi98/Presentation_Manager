package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.presentation.AutoSchedulingModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.room.RoomPresentationSlotsModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import com.fyp.presentationmanager.service.google.GoogleAPIService;
import com.fyp.presentationmanager.service.presentation.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("test")
public class TestCtrl {
    @Autowired
    private GoogleAPIService googleAPIService;
    @Autowired
    private PresentationService presentationService;
    @Autowired
    private ScheduleRepo scheduleRepo;

    @PostMapping(value = "/test")
    public ResponseModel<String> test(@RequestBody TimeRange timeRange) {
        ResponseModel<String> responseModel = new ResponseModel<>();
//        CalendarEventModel calendarEventModel=new CalendarEventModel();
//        calendarEventModel.setStartTime(timeRange.getStartTime());
//        calendarEventModel.setEndTime(timeRange.getEndTime());
//        this.googleAPIService.addGoogleCalendarEvent(calendarEventModel);
        //schedule time after today
        ScheduleBean scheduleBean = this.scheduleRepo.getById(7);
        List<PresentationModel> presentationModelList = new ArrayList<>();
        for (PresentationBean presentationBean : scheduleBean.getPresentationBeans()) {
            presentationModelList.add(PresentationModel.build(presentationBean));
        }
        List<TimeRange> availableScheduleTimeSlots = new ArrayList<>();

        TimeRange timeRange1 = new TimeRange(new Date(122, 0, 10, 9, 0),
                new Date(122, 0, 30, 10, 0));
        availableScheduleTimeSlots.add(timeRange1);
//        timeRange1 = new TimeRange(new Date(122, 0, 12, 12, 0),
//                new Date(122, 0, 13, 13, 0));
//        availableScheduleTimeSlots.add(timeRange1);
//        TimeRange timeRange1 = new TimeRange(new Date("2022-01-10 09:00:00.0"),
//                new Date("2022-01-11 10:00:00.0"));
//        availableScheduleTimeSlots.add(timeRange1);
//        timeRange1 = new TimeRange(new Date("2022-01-12 12:00:00.0"),
//                new Date("2022-01-13 13:00:00.0"));
//        availableScheduleTimeSlots.add(timeRange1);
        RoomPresentationSlotsModel roomPresentationSlotsModel = new RoomPresentationSlotsModel();
        roomPresentationSlotsModel.setId(2);
        roomPresentationSlotsModel.setName("ss");
        roomPresentationSlotsModel.setSlots(availableScheduleTimeSlots);
        RoomPresentationSlotsModel roomPresentationSlotsModel2 = new RoomPresentationSlotsModel();
        roomPresentationSlotsModel2.setId(3);
        roomPresentationSlotsModel2.setName("sssss");
        roomPresentationSlotsModel2.setSlots(availableScheduleTimeSlots);
        List<RoomPresentationSlotsModel> a = new ArrayList<>();
        a.add(roomPresentationSlotsModel);
        a.add(roomPresentationSlotsModel2);
        RoomPresentationSlotsModel onlineRoom = new RoomPresentationSlotsModel();
        onlineRoom.setId(1);
        onlineRoom.setName("Online");
        onlineRoom.setSlots(availableScheduleTimeSlots);

        AutoSchedulingModel autoSchedulingModel = new AutoSchedulingModel(7, presentationModelList, new ArrayList<>(), false, a, onlineRoom, 15);
        this.presentationService.autoScheduling(autoSchedulingModel);
        try {

        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }
}
