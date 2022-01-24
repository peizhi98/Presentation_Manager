package com.fyp.presentationmanager.model.presentation;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.PresentationPanelBean;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.model.ScheduleModel;
import com.fyp.presentationmanager.model.role.PanelModel;
import com.fyp.presentationmanager.model.role.SupervisorModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.TimeRange;
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
    private String studentMatrixNo;
    private String studentName;
    private String studentEmail;
    private Integer scheduleId;
    private String title;
    private Integer mark;
    private Integer resultStatus;
    private Date startTime;
    private Date endTime;

    private Integer roomId;
    private String roomName;
    private PresentationMode mode;
    private ScheduleModel scheduleModel;
    private SupervisorModel supervisorModel;
    private PanelModel chairperson;
    private List<PanelModel> panelModels;
    private List<TimeRange> commonAvailabilityList;
    //google
    private String calendarId;
    private String calendarHtmlLink;
    private Date lastSync;
    private String googleMeetLink;
    private Date calendarStartTime;
    private Date calendarEndTime;

    public static PresentationModel build(PresentationBean presentationBean) {
        PresentationModel presentationModel = new PresentationModel();
        presentationModel.setId(presentationBean.getId());
        presentationModel.setScheduleId(presentationBean.getScheduleId());
        presentationModel.setTitle(presentationBean.getTitle());
        presentationModel.setScheduleId(presentationBean.getScheduleId());
        presentationModel.setScheduleModel(new ScheduleModel(presentationBean.getScheduleBean()));
        presentationModel.setStudentEmail(presentationBean.getStudentEmail());
        presentationModel.setStudentMatrixNo(presentationBean.getStudentMatrixNo());
        presentationModel.setStudentName(presentationBean.getStudentName());
        presentationModel.setSupervisorModel(SupervisorModel.build(presentationBean.getSupervisorBean()));
        if (presentationBean.getChairPersonBean() != null) {
            presentationModel.setChairperson(PanelModel.build(presentationBean.getChairPersonBean()));
        }
        presentationModel.setStartTime(presentationBean.getStartTime());
        presentationModel.setEndTime(presentationBean.getEndTime());
        presentationModel.setRoomId(presentationBean.getRoomId());
        presentationModel.setMode(presentationBean.getMode());
        presentationModel.setCalendarId(presentationBean.getCalendarId());
        presentationModel.setLastSync(presentationBean.getLastSync());
        presentationModel.setGoogleMeetLink(presentationBean.getGoogleMeetLink());
        presentationModel.setCalendarHtmlLink(presentationBean.getCalendarHtmlLink());
        presentationModel.setCalendarStartTime(presentationBean.getCalendarStartTime());
        presentationModel.setCalendarEndTime(presentationBean.getCalendarEndTime());
        if (presentationBean.getRoomBean() != null) {
            presentationModel.setRoomName(presentationBean.getRoomBean().getName());
        }
        List<PanelModel> panelModels = new ArrayList<>();
        if (presentationBean.getPresentationPanelBeans() != null) {
            for (PresentationPanelBean presentationPanelBean : presentationBean.getPresentationPanelBeans()) {
                PanelModel panelModel = PanelModel.build(presentationPanelBean.getPanelBean());
                panelModels.add(panelModel);
            }
        }
        presentationModel.setPanelModels(panelModels);
        return presentationModel;
    }
}
