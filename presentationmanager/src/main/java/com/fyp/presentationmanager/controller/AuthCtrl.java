package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.auth.AuthenticationRequest;
import com.fyp.presentationmanager.model.auth.AuthenticationResponse;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthCtrl {

    @Autowired
    private AuthService authService;


    @PostMapping(value = "/login")
    private ResponseModel<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        ResponseModel<AuthenticationResponse> responseModel = new ResponseModel();
        try {
            AuthenticationResponse authenticationResponse = this.authService.login(authenticationRequest);
            responseModel.success(authenticationResponse);
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed(new AuthenticationResponse(null, null));
        }
        return responseModel;
    }

    @GetMapping(value = "/get-auth-user")
    private ResponseModel<UserModel> getAuthUser() {
        ResponseModel<UserModel> responseModel = new ResponseModel();
        try {
            responseModel.success(this.authService.getAuthUserModel());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed(null);
        }
        return responseModel;
    }
}
