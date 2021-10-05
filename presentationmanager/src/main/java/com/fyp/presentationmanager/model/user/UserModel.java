package com.fyp.presentationmanager.model.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserModel {
    private Integer id;
    private String email;
    private String name;
    private String password;
}
