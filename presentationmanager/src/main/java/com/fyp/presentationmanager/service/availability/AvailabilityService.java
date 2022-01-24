package com.fyp.presentationmanager.service.availability;

import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import com.fyp.presentationmanager.model.availability.UserAvailabilityModel;

import java.util.List;

public interface AvailabilityService {
    List<AvailabilityModel> getAuthUserAvailabilities();
    UserAvailabilityModel getUserAvailabilities(Integer userId);
    List<AvailabilityModel> addEditAndDeleteAuthUserAvailabilities(List<AvailabilityModel> updatedAvailabilities);
}
