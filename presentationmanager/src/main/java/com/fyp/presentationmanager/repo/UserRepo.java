package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.UserBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserBean, String> {
    UserBean findUserBeanByIdAndPassword(String id, String password);
    UserBean findUserBeanById(String id);
    UserBean findUserBeanByEmail(String email);
}
