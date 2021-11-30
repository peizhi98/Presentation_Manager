package com.fyp.presentationmanager.service.presentation;

import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.presentation.PresentationScheduleModel;

import java.util.List;

public interface PresentationService {
    List<PresentationModel> addPresentationList(List<PresentationModel> scheduleModelList);

    PresentationModel getPresentation(Integer id);

    List<PresentationModel> getPresentationList(Integer scheduleId);

    List<PresentationScheduleModel> schedulePresentations(List<PresentationScheduleModel> presentationScheduleModels);
}
