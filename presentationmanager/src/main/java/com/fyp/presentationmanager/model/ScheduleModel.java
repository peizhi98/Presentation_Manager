package com.fyp.presentationmanager.model;

import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.enums.PresentationType;
import com.fyp.presentationmanager.enums.ScheduleType;
import com.fyp.presentationmanager.model.role.CoordinatorModel;
import com.fyp.presentationmanager.model.role.SupervisorModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScheduleModel {
    private Integer id;
    private Integer coordinatorId;
    private Integer year;
    private Integer sem;
    private String title;
    private Integer duration;
    private ScheduleType scheduleType;
    private PresentationType presentationType;
    private Date createDate;
    private CoordinatorModel coordinator;
    private List<PresentationModel> presentationModels;

    public ScheduleModel(ScheduleBean scheduleBean) {
        this.id = scheduleBean.getId();
        this.coordinatorId = scheduleBean.getCoordinatorId();
        this.title = scheduleBean.getTitle();
        this.sem = scheduleBean.getSem();
        this.year = scheduleBean.getYear();
    }

}
