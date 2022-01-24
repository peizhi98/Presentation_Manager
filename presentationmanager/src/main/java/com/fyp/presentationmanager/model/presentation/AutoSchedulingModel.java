package com.fyp.presentationmanager.model.presentation;

import com.fyp.presentationmanager.model.room.RoomPresentationSlotsModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoSchedulingModel {
    private Integer scheduleId;
    private List<PresentationModel> presentationsToScheduleOnline;
    private List<PresentationModel> presentationsToSchedulePhysical;
    private Boolean considerAvailability;
    private List<RoomPresentationSlotsModel> roomPresentationSlotsModels;
    private RoomPresentationSlotsModel onlinePresentationSlotsModel;
    private Integer presentationDuration;
}
