package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.user.UserModel;

public interface UserService {
    Integer register(UserModel userModel);
    UserBean getUserById(Integer id);
}
