package com.fyp.presentationmanager.model.presentation;

import com.fyp.presentationmanager.model.room.RoomModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresentationTimetableModel {
    private List<RoomModel> roomModelList;
    private List<PresentationModel> presentationModels;
}
