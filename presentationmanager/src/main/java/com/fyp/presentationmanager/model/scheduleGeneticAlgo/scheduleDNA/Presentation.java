package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import com.fyp.presentationmanager.entity.PresentationBean;
import com.fyp.presentationmanager.entity.PresentationPanelBean;
import com.fyp.presentationmanager.entity.UserBean;
import com.fyp.presentationmanager.enums.PresentationMode;
import com.fyp.presentationmanager.util.DateTimeUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Presentation implements Cloneable, Comparable<Presentation> {
    private Integer id;
    private PresentationMode presentationMode;
    private Date startTime;
    private Date endTime;
    private List<Panel> panelList = new ArrayList<>();
    private Room room;

    public static Presentation build(PresentationBean presentationBean, PresentationMode mode) {
        Presentation presentation = new Presentation();
        presentation.setId(presentationBean.getId());
        presentation.setPresentationMode(mode);
        if (presentationBean.getPresentationPanelBeans() != null) {
            List<Panel> panels = new ArrayList<>();
            presentation.setPanelList(panels);
            // treat chairperson as panel, just to consider availability
            if (presentationBean.getChairPersonBean() != null) {
                UserBean chairperson = presentationBean.getChairPersonBean();
                Panel panel = new Panel();
                panel.setId(chairperson.getId());
                List<TimeRange> availabilitiesDuringSchedule
                        = chairperson.getAvailableTimeRangesAfterNow();
                panel.setAvailableTimeList(availabilitiesDuringSchedule);
                panels.add(panel);
            }
            for (PresentationPanelBean panelBean : presentationBean.getPresentationPanelBeans()) {
                Panel panel = new Panel();
                panel.setId(panelBean.getPanelId());
                List<TimeRange> availabilitiesDuringSchedule
                        = panelBean.getPanelBean().getAvailableTimeRangesAfterNow();
//                if (availabilitiesDuringSchedule == null) {
//                    throw new RuntimeException("Panel does not update availability");
//                }
                panel.setAvailableTimeList(availabilitiesDuringSchedule);
                panels.add(panel);
            }
        }
        return presentation;
    }

    public void setRoomAndInitMeetingTime(Room room) {
        this.room = room;
        for (int i = 0; i < 100; i++) {
            this.setMeetingTime(room.getMeetingSlots().get((int) (room.getMeetingSlots().size() * Math.random())));
            if (calculateNumberOfPanelNotAvailable() == 0) {
                break;
            }
        }
    }

    public void setMeetingTime(TimeRange timeRange) {
        this.startTime = timeRange.getStartTime();
        this.endTime = timeRange.getEndTime();
    }

    public int calculateNumberOfPanelNotAvailable() {
        int conflict = 0;
        for (Panel panel : this.panelList) {
            if (!panel.isAvailableOnTimeRange(this.startTime, this.endTime)) {
                conflict++;
            }
        }
        return conflict;
    }

    public boolean hasPanel(Panel findPanel) {
        for (Panel panel : this.panelList) {
            if (panel.getId() == findPanel.getId()) {
                return true;
            }
        }
        return false;
    }

    public boolean isBetweenTimeRange(TimeRange timeRange) {
        if (DateTimeUtil.timeRange1IsBetweenTimeRange2(
                this.startTime, this.endTime,
                timeRange.getStartTime(), timeRange.getEndTime()))
            return true;
        return false;
    }

    public Object clone() {
        try {
            return (Presentation) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    public PresentationBean findBean(List<PresentationBean> presentationBeans) {
        if (presentationBeans != null) {
            for (PresentationBean presentation : presentationBeans) {
                if (presentation.getId().equals(this.id)) {
                    return presentation;
                }
            }
        }
        return null;
    }

    @Override
    public int compareTo(@NotNull Presentation o) {
        if (this.startTime.after(o.getStartTime()))
            return 1;
        else if (this.startTime.before(o.getStartTime()))
            return -1;
        return 0;
    }
}
