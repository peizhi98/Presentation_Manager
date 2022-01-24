package com.fyp.presentationmanager.model;

import com.fyp.presentationmanager.entity.ScheduleBean;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.enums.ScheduleType;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.role.CoordinatorModel;
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
    private Integer year;
    private Integer sem;
    private String title;
    private ScheduleType scheduleType;
    private PresentationMode presentationMode;
    private Date createDate;
    private CoordinatorModel coordinator;
    private List<PresentationModel> presentationModels;

    public ScheduleModel(ScheduleBean scheduleBean) {
        this.id = scheduleBean.getId();
        this.coordinator=CoordinatorModel.build(scheduleBean.getCoordinator());
        this.title = scheduleBean.getTitle();
        this.sem = scheduleBean.getSem();
        this.year = scheduleBean.getYear();
        this.scheduleType=scheduleBean.getScheduleType();
        this.createDate=scheduleBean.getCreateDate();
    }

}
