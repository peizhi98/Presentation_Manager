package com.fyp.presentationmanager.model.auth;

import com.fyp.presentationmanager.model.user.UserModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthenticationResponse {
    private String jwt;
    private UserModel authUserModel;
}
