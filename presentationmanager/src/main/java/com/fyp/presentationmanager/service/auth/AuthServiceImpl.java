package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.model.auth.AuthenticationRequest;
import com.fyp.presentationmanager.model.auth.AuthenticationResponse;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserModel getAuthUserModel() {
        CustomUserDetails customUserDetails = this.getAuthUserDetails();
        UserModel authUserModel = UserModel.build(customUserDetails);
        return authUserModel;
    }

    @Override
    public AuthenticationResponse login(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        final CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        UserModel authUserModel = UserModel.build(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse(jwt, authUserModel);
        return authenticationResponse;
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
