package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.user.LecturerModel;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping(value = "get-all-lecturers")
    private ResponseModel<List<LecturerModel>> getAllLecturers() {
        ResponseModel<List<LecturerModel>> responseModel = new ResponseModel();
        try {
            List<LecturerModel> lecturerModels = userService.getAllLecturers();
            responseModel.success(lecturerModels, "Successfully registered account.");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return responseModel;
    }

    @GetMapping(value = "get-all-users")
    private ResponseModel<List<UserModel>> getAllUsers() {
        ResponseModel<List<UserModel>> responseModel = new ResponseModel();
        try {
            List<UserModel> lecturerModels = userService.getAllUsers();
            responseModel.success(lecturerModels, "Successfully registered account.");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return responseModel;
    }

    @PostMapping(value = "/edit-user")
    private ResponseModel<UserModel> editUser(@RequestBody UserModel editedUserModel) {
        ResponseModel<UserModel> responseModel = new ResponseModel();
        try {
            UserModel newUserId = userService.editUser(editedUserModel);
            responseModel.success(newUserId, "Successfully edited account.");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return responseModel;
    }

    @DeleteMapping(value = "/delete-user")
    private ResponseModel<Boolean> deleteUser(@RequestParam Integer id) {
        ResponseModel<Boolean> responseModel = new ResponseModel();
        try {
            boolean success = userService.deleteUser(id);
            if (success) {
                responseModel.success(success, "Successfully deleted account.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return responseModel;
    }

    @PostMapping(value = "/create-users")
    private ResponseModel<List<UserModel>> createUsers(@RequestBody List<UserModel> newUsers) {
        ResponseModel<List<UserModel>> responseModel = new ResponseModel();
        try {
            List<UserModel> userModels = userService.createUsers(newUsers);
            responseModel.success(userModels, "Successfully created users.");
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof DataIntegrityViolationException) {
                responseModel.failed(null, "Failed to create user. Email has been registered with another account.");
            } else {
                responseModel.failed(null, "Failed to create user.");
            }

        }

        return responseModel;
    }
}
