package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.PresentationModel;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.service.PresentationService;
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
        responseModel.success(presentationService.addPresentationList(presentationModelList));
        return responseModel;

    }

    @GetMapping(value = "/get-presentation")
    private ResponseModel<PresentationModel> addPresentationList(@RequestParam Integer id) {
        ResponseModel<PresentationModel> responseModel = new ResponseModel();
        responseModel.success(presentationService.getPresentation(id));
        return responseModel;

    }

    @GetMapping(value = "/get-presentations")
    private ResponseModel<List<PresentationModel>> getPresentations(@RequestParam Integer scheduleId) {
        ResponseModel<List<PresentationModel>> responseModel = new ResponseModel();
        responseModel.success(presentationService.getPresentationList(scheduleId));
        return responseModel;

    }
}
