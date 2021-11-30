package com.fyp.presentationmanager.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "presentation_room")
public class PresentationRoomBean implements Serializable {
    public static final String ID = "id";
    public static final String NAME = "name";
    private static final long serialVersionUID = -7771990716877154698L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = NAME, nullable = false)
    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
