package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import com.fyp.presentationmanager.util.DateTimeUtil;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Presentation implements Cloneable {
    private Integer id;
    private Date startTime;
    private Date endTime;
    private List<Panel> panelList = new ArrayList<>();

    public Presentation(Integer id, List<Panel> panelList) {
        this.id = id;
        if (panelList != null) {
            this.panelList = panelList;
        }
    }

    public int calculatePanelAvailableTimeConflict() {
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
        if (DateTimeUtil.timeRangeIsBetweenTimeRange(
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
}
