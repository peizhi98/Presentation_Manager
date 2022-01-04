package com.fyp.presentationmanager.repo.user;

import com.fyp.presentationmanager.entity.UserRoleBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRoleBean, Integer> {
}
