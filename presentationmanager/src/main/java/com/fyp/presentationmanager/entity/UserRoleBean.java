package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.SystemRole;

import javax.persistence.*;
import java.io.Serializable;

import static com.fyp.presentationmanager.entity.UserRoleBean.SYSTEM_ROLE;
import static com.fyp.presentationmanager.entity.UserRoleBean.USER_ID;

@Entity
@Table(name = "user_role",
        uniqueConstraints = @UniqueConstraint(columnNames = {USER_ID, SYSTEM_ROLE}))
public class UserRoleBean implements Serializable {
    public static final String ID = "id";
    public static final String USER_ID = "user_id";
    public static final String SYSTEM_ROLE = "system_role";
    private static final long serialVersionUID = -5465937058909584191L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = USER_ID)
    private Integer userId;

    @Column(name = SYSTEM_ROLE)
    private SystemRole systemRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = USER_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean userBean;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public SystemRole getSystemRole() {
        return systemRole;
    }

    public void setSystemRole(SystemRole systemRole) {
        this.systemRole = systemRole;
    }

    public UserBean getUserBean() {
        return userBean;
    }

    public void setUserBean(UserBean userBean) {
        this.userBean = userBean;
    }
}
