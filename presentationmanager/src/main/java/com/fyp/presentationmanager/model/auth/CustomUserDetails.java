package com.fyp.presentationmanager.model.auth;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.enums.SystemRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    Integer id;
    String name;
    String email;
    String password;
    List<SystemRole> systemRoles;


    public CustomUserDetails(Integer id, String name, String email, String password, List<SystemRole> systemRoles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.systemRoles = systemRoles;
    }

    public static CustomUserDetails build(UserBean userBean) {

        return new CustomUserDetails(
                userBean.getId(),
                userBean.getName(),
                userBean.getEmail(),
                userBean.getPassword(),
                userBean.getSystemRoleList());

    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<SystemRole> getSystemRoles() {
        return systemRoles;
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
