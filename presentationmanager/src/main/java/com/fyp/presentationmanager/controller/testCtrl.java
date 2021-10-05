package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.service.EvaluationFormService;
import com.fyp.presentationmanager.service.PresentationService;
import com.fyp.presentationmanager.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("test")
public class testCtrl {
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private PresentationService presentationService;

    @Autowired
    private EvaluationFormService evaluationFormService;

    @GetMapping(value = "test")
    public ResponseModel<String> test(@RequestParam String id) {
        ResponseModel<String> response = new ResponseModel<>();
        response.success(id);
//        evaluationFormService.addNewEvaluationForm(new EvaluationFormModel());
//        ScheduleModel scheduleModel = new ScheduleModel(
//                null,
//                "a",
//                2020,
//                1,
//                "SE FYP",
//                60,
//                ScheduleType.FYP,
//                PresentationType.ONLINE,
//                null,
//                null);
//        scheduleService.addOrEditSchedule(scheduleModel);
        return response;
    }
}
