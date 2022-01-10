package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.evaluation.FypEvaluationOverviewModel;
import com.fyp.presentationmanager.service.evaluation.EvaluationReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/evaluation-report")
public class EvaluationReportCtrl {
    @Autowired
    private EvaluationReportService evaluationReportService;

    @GetMapping(value = "/get-report-fyp")
    private ResponseModel<FypEvaluationOverviewModel> getFypEvaluationReport(@RequestParam Integer scheduleId) {
        ResponseModel<FypEvaluationOverviewModel> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationReportService.getFypEvaluationOverviewOfSchedule(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }
}
