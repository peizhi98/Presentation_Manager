package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.EvaluationFormModel;
import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import com.fyp.presentationmanager.service.availability.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class AvailabilityCtrl {
    @Autowired
    private AvailabilityService availabilityService;
    @PostMapping(value = "/add-edit-delete")
    private ResponseModel<List<AvailabilityModel>> addEditAndDeleteAvailabilities(@RequestBody List<AvailabilityModel> availabilityModels) {
        ResponseModel<List<AvailabilityModel>> responseModel = new ResponseModel();
        responseModel.success(availabilityService.addEditAndDeleteAuthUserAvailabilities(availabilityModels));
        return responseModel;

    }

    @GetMapping(value = "/get")
    private ResponseModel<List<AvailabilityModel>> getAvailabilities() {
        ResponseModel<List<AvailabilityModel>> responseModel = new ResponseModel();
        responseModel.success(availabilityService.getAuthUserAvailabilities());
        return responseModel;

    }
}
