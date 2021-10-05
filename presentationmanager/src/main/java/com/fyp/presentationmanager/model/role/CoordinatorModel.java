package com.fyp.presentationmanager.model.role;

import com.fyp.presentationmanager.entity.UserBean;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CoordinatorModel {
    private Integer id;
    private String email;
    private String name;

    public static CoordinatorModel build(UserBean userBean) {
        return new CoordinatorModel(userBean.getId(), userBean.getEmail(), userBean.getName());
    }
}
