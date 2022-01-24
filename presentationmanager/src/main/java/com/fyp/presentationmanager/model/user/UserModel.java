package com.fyp.presentationmanager.model.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.enums.SystemRole;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.availability.AvailabilityModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserModel {
    private Integer id;
    private String email;
    private String name;
    private String password;
    private List<SystemRole> systemRoles;
    private List<AvailabilityModel> availabilityModels;

    public static UserModel build(CustomUserDetails customUserDetails) {
        UserModel authUserModel = new UserModel();
        authUserModel.setId(customUserDetails.getId());
        authUserModel.setName(customUserDetails.getName());
        authUserModel.setSystemRoles(customUserDetails.getSystemRoles());
        authUserModel.setEmail(customUserDetails.getUsername());
        return authUserModel;
    }

    public static UserModel build(UserBean userBean) {
        UserModel authUserModel = new UserModel();
        authUserModel.setId(userBean.getId());
        authUserModel.setName(userBean.getName());
        authUserModel.setSystemRoles(userBean.getSystemRoleList());
        authUserModel.setEmail(userBean.getEmail());
        return authUserModel;
    }
}
