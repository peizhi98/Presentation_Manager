package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.model.auth.AuthUserModel;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.UserModel;

public interface AuthService {
    CustomUserDetails getAuthUserDetails();
    UserModel getAuthUserModel();
}
