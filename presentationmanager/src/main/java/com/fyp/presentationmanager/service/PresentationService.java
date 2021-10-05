package com.fyp.presentationmanager.service;

import com.fyp.presentationmanager.model.PresentationModel;

import java.util.List;

public interface PresentationService {
    List<PresentationModel> addPresentationList(List<PresentationModel> scheduleModelList);

    PresentationModel getPresentation(Integer id);

    List<PresentationModel> getPresentationList(Integer scheduleId);
}
