package com.fyp.presentationmanager.model.role;


import com.fyp.presentationmanager.entity.UserBean;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PanelModel {
    private Integer id;
    private String email;
    private String name;

    public static PanelModel build(UserBean userBean) {
        return new PanelModel(userBean.getId(), userBean.getEmail(), userBean.getName());
    }

}
