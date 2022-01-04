package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.enums.EvaluationType;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.evaluation.EvaluationModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.service.evaluation.EvaluationFormService;
import com.fyp.presentationmanager.service.evaluation.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluation")
public class EvaluationCtrl {
    @Autowired
    private EvaluationService evaluationService;

    @PostMapping(value = "/evaluate")
    private ResponseModel<EvaluationModel> evaluate(@RequestBody EvaluationModel evaluationModel) {
        ResponseModel<EvaluationModel> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationService.evaluate(evaluationModel));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }

    @GetMapping(value = "/get-auth-evaluation")
    private ResponseModel<EvaluationModel> getAuthUserEvaluation(@RequestParam EvaluationType evaluationType, Integer presentationId) {
        ResponseModel<EvaluationModel> responseModel = new ResponseModel();
        try {
            responseModel.success(evaluationService.getAuthUserEvaluation(evaluationType,presentationId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;
    }
}
