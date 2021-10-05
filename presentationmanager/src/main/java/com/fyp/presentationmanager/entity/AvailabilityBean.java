package com.fyp.presentationmanager.entity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "availability")
public class AvailabilityBean implements Serializable {
    public static final String ID = "id";
    public static final String USER_ID = "user_id";
    public static final String START_TIME = "start_time";
    public static final String END_TIME = "end_time";
    private static final long serialVersionUID = -6851595351509725366L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = USER_ID, nullable = false)
    private Integer userId;

    @Column(name = START_TIME, nullable = false)
    private Date startTime;

    @Column(name = END_TIME, nullable = false)
    private Date endTime;

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

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date from) {
        this.startTime = from;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public UserBean getUserBean() {
        return userBean;
    }

    public void setUserBean(UserBean userBean) {
        this.userBean = userBean;
    }
}
