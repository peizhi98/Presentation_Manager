package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.model.auth.CustomUserDetails;
import com.fyp.presentationmanager.model.user.LecturerModel;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.repo.UserRepo;
import com.fyp.presentationmanager.service.auth.UserDetailsServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    public Integer register(UserModel userModel) {
        if (!StringUtils.isEmpty(userModel.getPassword()) && !StringUtils.isEmpty(userModel.getEmail())) {
            UserBean userBean = UserBean.build(userModel);
            this.saveUser(userBean);
            return userBean.getId();
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Override
    public UserBean getUserById(Integer id) {
        return this.userRepo.getById(id);
    }

    public UserBean getUserOrCreateWithEmptyPwIfNotExist(String username) {
        UserBean userBean = this.getUserByEmail(username);
        if (userBean == null) {
            userBean=new UserBean();
            userBean.setEmail(username);
            this.saveUser(userBean);
        }
        return userBean;
    }

    @Override
    public List<LecturerModel> getAllLecturers() {
        List<UserBean> userBeans=this.userRepo.findAll();
        List<LecturerModel> lecturerModels=new ArrayList<>();
        if(userBeans!=null){
            for (UserBean userBean:userBeans){
                LecturerModel lecturer=new LecturerModel();
                lecturer.setId(userBean.getId());
                lecturer.setName(userBean.getName());
                lecturer.setEmail(userBean.getEmail());
                lecturerModels.add(lecturer);
            }
        }
        return lecturerModels;
    }

    private UserBean getUserByEmail(String email) {
        return this.userRepo.findUserBeanByEmail(email);
    }

    private UserBean saveUser(UserBean userBean) {
        return this.userRepo.save(userBean);
    }

}
