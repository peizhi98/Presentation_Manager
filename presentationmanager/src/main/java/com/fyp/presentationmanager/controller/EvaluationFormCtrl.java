package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.evaluation.EvaluationFormModel;
import com.fyp.presentationmanager.service.evaluation.EvaluationFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/evaluation-form")
public class EvaluationFormCtrl {
    @Autowired
    private EvaluationFormService evaluationFormService;

    @GetMapping(value = "/get-evaluation-form")
    private ResponseModel<EvaluationFormModel> getEvaluationForm(@RequestParam EvaluationType evaluationType, @RequestParam Integer scheduleId) {
        ResponseModel<EvaluationFormModel> responseModel = new ResponseModel();
        responseModel.success(evaluationFormService.getEvaluationForm(scheduleId, evaluationType));
        return responseModel;

    }

    @PostMapping(value = "/add-edit-evaluation-form")
    private ResponseModel<EvaluationFormModel> addOrEditEvaluationForm(@RequestBody EvaluationFormModel evaluationFormModel) {
        ResponseModel<EvaluationFormModel> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationFormService.addOrEditEvaluationForm(evaluationFormModel));
        } catch (Exception e) {
            responseModel.failed(null, e.getMessage());
            e.printStackTrace();
        }
        return responseModel;

    }
}
