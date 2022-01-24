package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import com.fyp.presentationmanager.model.room.RoomModel;
import com.fyp.presentationmanager.service.room.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/room")
public class RoomCtrl {
    @Autowired
    private RoomService roomService;
    @GetMapping(value = "/get-all")
    private ResponseModel<List<RoomModel>> getRooms() {
        ResponseModel<List<RoomModel>> responseModel = new ResponseModel();
        try{
            responseModel.success(roomService.getAllRooms());
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed();
        }

        return responseModel;

    }
}
