package com.fyp.presentationmanager.controller;

import com.fyp.presentationmanager.model.ResponseModel;
import com.fyp.presentationmanager.model.auth.AuthenticationRequest;
import com.fyp.presentationmanager.model.auth.AuthenticationResponse;
import com.fyp.presentationmanager.util.JwtUtil;
import com.fyp.presentationmanager.service.auth.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthCtrl {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(value = "/login")
    private ResponseModel<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        ResponseModel<AuthenticationResponse> responseModel = new ResponseModel();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword()));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);
            responseModel.success(new AuthenticationResponse(jwt));
        } catch (Exception e) {
            e.printStackTrace();
            responseModel.failed(new AuthenticationResponse(null));
        }
        return responseModel;
    }
}
