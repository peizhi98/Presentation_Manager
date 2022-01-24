package com.fyp.presentationmanager.model.availability;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserAvailabilityModel {
    Integer userId;
    String nameOfUser;
    List<AvailabilityModel> availabilityModels;
}
