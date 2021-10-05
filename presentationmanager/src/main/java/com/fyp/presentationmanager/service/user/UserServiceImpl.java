package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;

    @Override
    public Integer register(UserModel userModel) {
        UserBean userBean = new UserBean(userModel);
        this.userRepo.save(userBean);
        return userBean.getId();
    }
}
