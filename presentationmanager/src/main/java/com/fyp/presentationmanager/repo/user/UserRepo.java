package com.fyp.presentationmanager.repo.user;

import com.fyp.presentationmanager.entity.UserBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<UserBean, Integer> {
    UserBean findUserBeanByEmail(String email);
}
