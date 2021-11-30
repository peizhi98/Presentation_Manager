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
        CustomUserDetails authUserDetails = authService.getAuthUserDetails();
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
        CustomUserDetails authUserDetails = authService.getAuthUserDetails();
        List<AvailabilityBean> existingAvailabilities = this.availabilityRepo.findAvailabilityBeansByUserId(authUserDetails.getId());

        if (updatedAvailabilities != null) {
            if (existingAvailabilities != null) {
                compareModelsAndDeleteBeans(existingAvailabilities, updatedAvailabilities);
            }
            for (AvailabilityModel availabilityModel : updatedAvailabilities) {
                AvailabilityBean availabilityBean;
                if (availabilityModel.getId() != null) {
                    availabilityBean = this.availabilityRepo.getById(availabilityModel.getId());
                } else {
                    availabilityBean = new AvailabilityBean();
                }
                availabilityBean.setStartTime(availabilityModel.getStartTime());
                availabilityBean.setEndTime(availabilityModel.getEndTime());
                availabilityBean.setUserId(authUserDetails.getId());
                existingAvailabilities.add(availabilityBean);
            }
        }
        this.availabilityRepo.saveAll(existingAvailabilities);
        return updatedAvailabilities;
    }

    private void compareModelsAndDeleteBeans(List<AvailabilityBean> availabilityBeans, List<AvailabilityModel> availabilityModels) {
        if (availabilityBeans != null) {
            List<AvailabilityBean> availabilityBeansCopy = new ArrayList<>(availabilityBeans);
            for (AvailabilityBean availabilityBean : availabilityBeansCopy) {
                if (!findBeanFromModelsById(availabilityBean, availabilityModels)) {
                    availabilityBeans.remove(availabilityBeans.indexOf(availabilityBean));
                    this.deleteAvailabilityBeanById(availabilityBean.getId());
                }
            }
        }

    }

    private boolean findBeanFromModelsById(AvailabilityBean availabilityBean, List<AvailabilityModel> availabilityModels) {
        if (availabilityModels != null) {
            for (AvailabilityModel availabilityModel : availabilityModels) {
                if (availabilityBean.getId() == availabilityModel.getId())
                    return true;
            }
        }
        return false;
    }

    public void deleteAvailabilityBeanById(Integer id) {
        this.availabilityRepo.deleteById(id);
    }
}
