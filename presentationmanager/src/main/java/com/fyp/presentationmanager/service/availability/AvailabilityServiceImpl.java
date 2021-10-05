package com.fyp.presentationmanager.service.availability;

import com.fyp.presentationmanager.entity.AvailabilityBean;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import com.fyp.presentationmanager.repo.AvailabilityRepo;
import com.fyp.presentationmanager.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {
    @Autowired
    private AuthService authService;
    @Autowired
    private AvailabilityRepo availabilityRepo;

    @Override
    public List<AvailabilityModel> getAuthUserAvailabilities() {
        CustomUserDetails authUserDetails = authService.getAuthUser();
        List<AvailabilityBean> availabilityBeans = this.availabilityRepo.findAvailabilityBeansByUserId(authUserDetails.getId());
        List<AvailabilityModel> availabilityModels = new ArrayList<>();
        if (availabilityBeans != null) {
            for (AvailabilityBean availabilityBean : availabilityBeans) {
                AvailabilityModel availabilityModel = new AvailabilityModel();
                availabilityModel.setId(availabilityBean.getId());
                availabilityModel.setStartTime(availabilityBean.getStartTime());
                availabilityModel.setEndTime(availabilityBean.getEndTime());
                availabilityModels.add(availabilityModel);
            }
        }
        return availabilityModels;
    }

    @Override
    public List<AvailabilityModel> addEditAndDeleteAuthUserAvailabilities(List<AvailabilityModel> updatedAvailabilities) {
        CustomUserDetails authUserDetails = authService.getAuthUser();
        List<AvailabilityBean> availabilityBeans = new ArrayList<>();
        if (updatedAvailabilities != null) {
            for (AvailabilityModel availabilityModel : updatedAvailabilities) {
                AvailabilityBean availabilityBean = new AvailabilityBean();
                availabilityBean.setStartTime(availabilityModel.getStartTime());
                availabilityBean.setEndTime(availabilityModel.getEndTime());
                availabilityBean.setUserId(authUserDetails.getId());
                availabilityBeans.add(availabilityBean);
            }
        }
        this.availabilityRepo.saveAll(availabilityBeans);
        return updatedAvailabilities;
    }
}
