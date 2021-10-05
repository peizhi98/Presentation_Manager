package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.model.user.UserModel;

import javax.persistence.*;
import java.io.Serializable;

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

    @Column(name = EMAIL, unique = true)
    private String email;

    @Column(name = NAME)
    private String name;

    @Column(name = PASSWORD)
    private String password;


    public UserBean() {
    }

    public UserBean(UserModel userModel) {
        this.email = userModel.getEmail();
        this.password = userModel.getPassword();
        this.name = userModel.getName();
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
}
