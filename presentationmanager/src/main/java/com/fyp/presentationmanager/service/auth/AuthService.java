package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.model.auth.AuthenticationRequest;
import com.fyp.presentationmanager.model.auth.AuthenticationResponse;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.UserModel;

public interface AuthService {
    AuthenticationResponse login(AuthenticationRequest authenticationRequest);
    CustomUserDetails getAuthUserDetails();
    UserModel getAuthUserModel();
}
