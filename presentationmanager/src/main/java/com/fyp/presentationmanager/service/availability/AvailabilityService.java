package com.fyp.presentationmanager.service.availability;

import com.fyp.presentationmanager.model.availability.AvailabilityModel;

import java.util.List;

public interface AvailabilityService {
    List<AvailabilityModel> getAuthUserAvailabilities();
    List<AvailabilityModel> addEditAndDeleteAuthUserAvailabilities(List<AvailabilityModel> updatedAvailabilities);
}
