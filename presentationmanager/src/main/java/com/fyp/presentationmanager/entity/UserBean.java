package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.SystemRole;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
import com.fyp.presentationmanager.model.user.UserModel;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
public class UserBean implements Serializable {

    public static final String ID = "id";
    public static final String EMAIL = "EMAIL";
    public static final String PASSWORD = "password";
    public static final String NAME = "name";
    private static final long serialVersionUID = 7840657448662406716L;
    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = EMAIL, unique = true, nullable = false)
    private String email;

    @Column(name = NAME, nullable = false)
    private String name;

    @Column(name = PASSWORD, nullable = false)
    private String password;

    @OneToMany(mappedBy = "userBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<UserRoleBean> userRoleBeans;

    @OneToMany(mappedBy = "userBean", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AvailabilityBean> availabilityBeans;

    public UserBean() {
    }

    private UserBean(UserModel userModel) {
        this.email = userModel.getEmail();
        this.password = userModel.getPassword();
        this.name = userModel.getName();
    }

    public static UserBean build(UserModel userModel) {
        return new UserBean(userModel);
    }

    public static UserBean build(String username) {
        UserBean userBean = new UserBean();
        userBean.setEmail(username);
        return userBean;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UserRoleBean> getUserRoleBeans() {
        return userRoleBeans;
    }

    public void setUserRoleBeans(List<UserRoleBean> userRoleBeans) {
        this.userRoleBeans = userRoleBeans;
    }

    public List<SystemRole> getSystemRoleList() {
        List<SystemRole> systemRoles = new ArrayList<>();
        if (this.userRoleBeans != null) {
            for (UserRoleBean userRoleBean : this.userRoleBeans) {
                systemRoles.add(userRoleBean.getSystemRole());
            }
        }
        return systemRoles;
    }

    public List<AvailabilityBean> getAvailabilityBeans() {
        return availabilityBeans;
    }

    public void setAvailabilityBeans(List<AvailabilityBean> availabilityBeans) {
        this.availabilityBeans = availabilityBeans;
    }

    public List<TimeRange> getAvailableTimeRangesBetween(List<TimeRange> timeRanges) {
        if (this.availabilityBeans != null) {
            List<TimeRange> availabilities = new ArrayList<>();
            for (AvailabilityBean availabilityBean : this.availabilityBeans) {
                if (availabilityBean.containedIn(timeRanges)) {
                    availabilities.add(availabilityBean.toTimeRange());
                }

            }
            return availabilities;
        }
        return null;
    }

}
