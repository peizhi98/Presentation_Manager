package com.fyp.presentationmanager.model.presentation;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.PresentationPanelBean;
import com.fyp.presentationmanager.model.role.PanelModel;
import com.fyp.presentationmanager.model.role.SupervisorModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresentationModel {
    private Integer id;
    private String studentName;
    private String studentEmail;
    private Integer scheduleId;
    private String title;
    private Integer mark;
    private Integer resultStatus;
    private Date startTime;
    private Date endTime;
    private Integer roomId;
    private String venue;
    private SupervisorModel supervisorModel;
    private List<PanelModel> panelModels;

    public static PresentationModel build(PresentationBean presentationBean) {
        PresentationModel presentationModel = new PresentationModel();
        presentationModel.setId(presentationBean.getId());
        presentationModel.setScheduleId(presentationBean.getScheduleId());
        presentationModel.setTitle(presentationBean.getTitle());
        presentationModel.setScheduleId(presentationBean.getScheduleId());
        presentationModel.setStudentEmail(presentationBean.getStudentEmail());
        presentationModel.setStudentName(presentationBean.getStudentName());
        presentationModel.setSupervisorModel(SupervisorModel.build(presentationBean.getSupervisorBean()));
        presentationModel.setStartTime(presentationBean.getStartTime());
        presentationModel.setEndTime(presentationBean.getEndTime());
        presentationModel.setRoomId(presentationBean.getRoomId());
        presentationModel.setVenue(presentationBean.getVenue());
        List<PanelModel> panelModels = new ArrayList<>();
        if (presentationBean.getPanelBeans() != null) {
            for (PresentationPanelBean presentationPanelBean : presentationBean.getPanelBeans()) {
                PanelModel panelModel = PanelModel.build(presentationPanelBean.getPanelBean());
                panelModels.add(panelModel);
            }
        }
        presentationModel.setPanelModels(panelModels);
        return presentationModel;
    }
}
