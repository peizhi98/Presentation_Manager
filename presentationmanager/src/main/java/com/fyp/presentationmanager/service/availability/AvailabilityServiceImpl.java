package com.fyp.presentationmanager.service.availability;

import com.fyp.presentationmanager.entity.AvailabilityBean;
import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import com.fyp.presentationmanager.model.availability.UserAvailabilityModel;
import com.fyp.presentationmanager.repo.AvailabilityRepo;
import com.fyp.presentationmanager.repo.user.UserRepo;
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
    @Autowired
    private UserRepo userRepo;

    @Override
    public List<AvailabilityModel> getAuthUserAvailabilities() {
        CustomUserDetails authUserDetails = authService.getAuthUserDetails();
        List<AvailabilityBean> availabilityBeans = this.availabilityRepo.findAvailabilityBeansByUserId(authUserDetails.getId());
        List<AvailabilityModel> availabilityModels = new ArrayList<>();
        if (availabilityBeans != null) {
            for (AvailabilityBean availabilityBean : availabilityBeans) {
                AvailabilityModel availabilityModel = AvailabilityModel.build(availabilityBean);
                availabilityModels.add(availabilityModel);
            }
        }
        return availabilityModels;
    }

    @Override
    public UserAvailabilityModel getUserAvailabilities(Integer userId) {
        UserBean user = this.userRepo.getById(userId);
        if (user != null) {
            UserAvailabilityModel userAvailabilityModel = new UserAvailabilityModel();
            userAvailabilityModel.setUserId(user.getId());
            userAvailabilityModel.setNameOfUser(user.getName());
            List<AvailabilityModel> availabilityModels = new ArrayList<>();
            userAvailabilityModel.setAvailabilityModels(availabilityModels);
            if (user.getAvailabilityBeans() != null) {
                for (AvailabilityBean availabilityBean : user.getAvailabilityBeans()) {
                    AvailabilityModel availabilityModel = AvailabilityModel.build(availabilityBean);
                    availabilityModels.add(availabilityModel);
                }
            }
            return userAvailabilityModel;
        }
        throw new RuntimeException("User Not Found.");
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
