package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.model.auth.AuthUserModel;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public UserModel getAuthUserModel() {
        CustomUserDetails customUserDetails = this.getAuthUserDetails();
        UserModel authUserModel = new UserModel();
        authUserModel.setId(customUserDetails.getId());
        authUserModel.setName(customUserDetails.getName());
        return authUserModel;
    }

    @Override
    public CustomUserDetails getAuthUserDetails() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
            if (token != null) {
                return (CustomUserDetails) userDetailsService.loadUserByUsername((String) token.getPrincipal());

            }
        }
        throw new RuntimeException("User not authenticated.");
    }
}
