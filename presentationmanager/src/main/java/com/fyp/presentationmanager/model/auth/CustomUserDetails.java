package com.fyp.presentationmanager.model.auth;

import com.fyp.presentationmanager.entity.UserBean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    Integer id;
    String email;
    String password;


    public CustomUserDetails(Integer id,String email, String password) {
        this.id = id;
        this.email=email;
        this.password = password;
    }

    public static CustomUserDetails build(UserBean userBean) {

        return new CustomUserDetails(
                userBean.getId(),
                userBean.getEmail(),
                userBean.getPassword());
    }

    public Integer getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
