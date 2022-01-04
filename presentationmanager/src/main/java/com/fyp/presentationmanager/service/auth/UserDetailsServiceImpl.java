package com.fyp.presentationmanager.service.auth;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.repo.user.UserRepo;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserBean authUser = userRepo.findUserBeanByEmail(username);
        return CustomUserDetails.build(authUser);
    }
}
