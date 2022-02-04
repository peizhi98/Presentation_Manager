package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.evaluation.CriterionEvaluationReportModel;
import com.fyp.presentationmanager.model.evaluation.FypEvaluationOverviewModel;
import com.fyp.presentationmanager.model.evaluation.MasterEvaluationOverviewModel;
import com.fyp.presentationmanager.service.evaluation.EvaluationReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping(value = "/get-report-master")
    private ResponseModel<MasterEvaluationOverviewModel> getMasterEvaluationReport(@RequestParam Integer scheduleId) {
        ResponseModel<MasterEvaluationOverviewModel> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationReportService.getMasterEvaluationOverviewOfSchedule(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @GetMapping(value = "/get-presentation-evaluation-of-type")
    private ResponseModel<List<CriterionEvaluationReportModel>> getPresentationEvaluationOfType
            (@RequestParam EvaluationType evaluationType, @RequestParam Integer presentationId) {
        ResponseModel<List<CriterionEvaluationReportModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationReportService.getCriterionEvaluationReport(evaluationType, presentationId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed(null, e.getMessage());
        }
        return responseModel;

    }
}
