package com.fyp.presentationmanager.model.role;

import com.fyp.presentationmanager.entity.UserBean;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SupervisorModel {
    private Integer id;
    private String email;
    private String name;

    public static SupervisorModel build(UserBean userBean) {
        return new SupervisorModel(userBean.getId(), userBean.getEmail(), userBean.getName());
    }
}
