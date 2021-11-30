package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;
import com.fyp.presentationmanager.service.presentation.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/presentation")
public class PresentationCtrl {
    @Autowired
    private PresentationService presentationService;

    @PostMapping(value = "/add-presentation-list")
    private ResponseModel<List<PresentationModel>> addPresentationList(@RequestBody List<PresentationModel> presentationModelList) {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.addPresentationList(presentationModelList));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentation")
    private ResponseModel<PresentationModel> addPresentationList(@RequestParam Integer id) {
        ResponseModel<PresentationModel> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentation(id));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @GetMapping(value = "/get-presentations")
    private ResponseModel<List<PresentationModel>> getPresentations(@RequestParam Integer scheduleId) {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.getPresentationList(scheduleId));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }

    @PostMapping(value = "/schedule-presentations")
    private ResponseModel<List<PresentationScheduleModel>> schedulePresentations(@RequestBody List<PresentationScheduleModel> presentationModelList) {
        ResponseModel<List<PresentationScheduleModel>> responseModel = new ResponseModel();
        try {
            responseModel.success(presentationService.schedulePresentations(presentationModelList));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }
        return responseModel;

    }
}
