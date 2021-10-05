package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserCtrl {
    @Autowired
    private UserService userService;

    @PostMapping(value = "/register")
    private ResponseModel<Integer> register(@RequestBody UserModel newUserModel) {
        ResponseModel<Integer> responseModel = new ResponseModel();
        try {
            Integer newUserId = userService.register(newUserModel);
            responseModel.success(newUserId, "Successfully registered account.");
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof DataIntegrityViolationException) {
                responseModel.failed(null, "Failed to register account. This email has been registered.");
            } else {
                responseModel.failed(null, "Failed to register account.");
            }

        }

        return responseModel;
    }
}
