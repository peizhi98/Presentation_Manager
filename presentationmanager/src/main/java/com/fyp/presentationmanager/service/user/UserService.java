package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.LecturerModel;
import com.fyp.presentationmanager.model.user.UserModel;

import java.util.List;

public interface UserService {
    Integer register(UserModel userModel);
    UserBean getUserById(Integer id);
    UserBean getUserOrCreateWithEmptyPwIfNotExist(String username);
    List<LecturerModel> getAllLecturers();
}
