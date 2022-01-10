package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.user.LecturerModel;
import com.fyp.presentationmanager.model.user.UserModel;

import java.util.List;

public interface UserService {
    Integer register(UserModel userModel);

    UserBean getUserById(Integer id);

    UserBean getUserByEmail(String email);

    UserBean getUserOrCreateWithEmptyPwIfNotExist(String username);

    List<LecturerModel> getAllLecturers();

    List<UserModel> getAllUsers();

    UserModel editUser(UserModel userModel);

    boolean deleteUser(Integer id);

    List<UserModel> createUsers(List<UserModel> newUsers);

}
