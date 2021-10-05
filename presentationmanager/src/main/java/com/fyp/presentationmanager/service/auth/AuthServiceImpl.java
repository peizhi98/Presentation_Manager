package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Override
    public CustomUserDetails getAuthUser() {
        if(SecurityContextHolder.getContext().getAuthentication() != null) {
            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
            if(token != null) {
                return (CustomUserDetails) userDetailsService.loadUserByUsername((String)token.getPrincipal());

            }
        }
        throw new RuntimeException("User not authenticated.");
    }
}
