package com.fyp.presentationmanager.service.user;

import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.entity.UserRoleBean;
import com.fyp.presentationmanager.enums.SystemRole;
import com.fyp.presentationmanager.model.user.LecturerModel;
import com.fyp.presentationmanager.model.user.UserModel;
import com.fyp.presentationmanager.repo.user.UserRepo;
import com.fyp.presentationmanager.repo.user.UserRoleRepo;
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
    private UserRoleRepo userRoleRepo;
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
            userBean = new UserBean();
            userBean.setEmail(username);
            this.saveUser(userBean);
        }
        return userBean;
    }

    //to-do: update after user management done
    @Override
    public List<LecturerModel> getAllLecturers() {
        List<UserBean> userBeans = this.userRepo.findAll();
        List<LecturerModel> lecturerModels = new ArrayList<>();
        if (userBeans != null) {
            for (UserBean userBean : userBeans) {
                LecturerModel lecturer = new LecturerModel();
                lecturer.setId(userBean.getId());
                lecturer.setName(userBean.getName());
                lecturer.setEmail(userBean.getEmail());
                lecturerModels.add(lecturer);
            }
        }
        return lecturerModels;
    }

    @Override
    public List<UserModel> getAllUsers() {
        List<UserBean> userBeans = this.userRepo.findAll();
        List<UserModel> userModels = new ArrayList<>();
        if (userBeans != null) {
            for (UserBean userBean : userBeans) {
                UserModel user = new UserModel();
                user.setId(userBean.getId());
                user.setName(userBean.getName());
                user.setEmail(userBean.getEmail());
                List<SystemRole> systemRoles = new ArrayList<>();
                user.setSystemRoles(systemRoles);
                if (userBean.getUserRoleBeans() != null) {
                    for (UserRoleBean userRoleBean : userBean.getUserRoleBeans()) {
                        systemRoles.add(userRoleBean.getSystemRole());
                    }
                }
                userModels.add(user);
            }
        }
        return userModels;

    }

    @Override
    public UserModel editUser(UserModel userModel) {
        UserBean userBean = this.userRepo.getById(userModel.getId());
        if (userBean != null) {
            userBean.setName(userModel.getName());
            if (userModel.getSystemRoles() != null) {
                List<SystemRole> updatedRoles = userModel.getSystemRoles();
                List<UserRoleBean> existingRoleBeans = userBean.getUserRoleBeans();
                compareAndDeleteFromExistingRoles(existingRoleBeans, updatedRoles);
                List<SystemRole> existingRoleSet = userBean.getSystemRoleList();
                updatedRoles.removeAll(existingRoleSet);
                for (SystemRole role : updatedRoles) {
                    UserRoleBean userRoleBean = new UserRoleBean();
                    userRoleBean.setUserId(userBean.getId());
                    userRoleBean.setSystemRole(role);
                    this.userRoleRepo.save(userRoleBean);
                }
            }
        }
        return userModel;
    }

    private void compareAndDeleteFromExistingRoles(List<UserRoleBean> existingRoles, List<SystemRole> updatedRoles) {
        if (existingRoles != null) {
            List<UserRoleBean> existingRolesCopy = new ArrayList<>(existingRoles);
            for (UserRoleBean roleCopy : existingRolesCopy) {
                if (!findRoleInUpdatedRoles(roleCopy.getSystemRole(), updatedRoles)) {
                    existingRoles.remove(existingRoles.indexOf(roleCopy));
                    this.userRoleRepo.deleteById(roleCopy.getId());
                }
            }
        }
    }

    private void compareAndAddToExistingRoleList(List<UserRoleBean> existingRoles, List<SystemRole> updatedRoles) {
        if (existingRoles != null) {
            List<UserRoleBean> existingRolesCopy = new ArrayList<>(existingRoles);
            for (UserRoleBean roleCopy : existingRolesCopy) {
                if (!findRoleInUpdatedRoles(roleCopy.getSystemRole(), updatedRoles)) {
                    existingRoles.remove(existingRoles.indexOf(roleCopy));
                    this.userRoleRepo.deleteById(roleCopy.getId());
                }
            }
        }
    }

    private boolean findRoleInUpdatedRoles(SystemRole role, List<SystemRole> updatedRoles) {
        if (updatedRoles != null) {
            for (SystemRole latestRole : updatedRoles) {
                if (latestRole.equals(role)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean deleteUser(Integer id) {
        this.userRepo.deleteById(id);
        return true;
    }

    @Override
    public List<UserModel> createUsers(List<UserModel> newUserModels) {
        if (newUserModels != null) {
            for (UserModel newUserModel : newUserModels) {
                if (validUserModel(newUserModel)) {
                    UserBean userBean = UserBean.build(newUserModel);
                    this.userRepo.save(userBean);
                    for (SystemRole systemRole : newUserModel.getSystemRoles()) {
                        UserRoleBean userRoleBean = new UserRoleBean();
                        userRoleBean.setUserId(userBean.getId());
                        userRoleBean.setSystemRole(systemRole);
                        this.userRoleRepo.save(userRoleBean);
                    }
                }
            }
        }
        return newUserModels;
    }

    private boolean validUserModel(UserModel newUserModel) {
        if (!StringUtils.isEmpty(newUserModel.getPassword())
                && !StringUtils.isEmpty(newUserModel.getEmail())
                && !StringUtils.isEmpty(newUserModel.getName())
                && newUserModel.getSystemRoles() != null
                && newUserModel.getSystemRoles().size() > 0) {
            return true;
        }
        return false;
    }

    public UserBean getUserByEmail(String email) {
        return this.userRepo.findUserBeanByEmail(email);
    }

    private UserBean saveUser(UserBean userBean) {
        return this.userRepo.save(userBean);
    }

}
