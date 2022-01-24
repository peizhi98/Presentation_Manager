package com.fyp.presentationmanager.service.google;

import com.fyp.presentationmanager.model.google.CalendarEventModel;
import com.fyp.presentationmanager.model.presentation.PresentationModel;
import com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA.Presentation;

public interface GoogleAPIService {
    String addOrUpdateGoogleCalendarEvent(CalendarEventModel calendarEventModel);
    PresentationModel addOrUpdateGoogleCalendarEvent(PresentationModel presentationModel, String scheduleTitle);
}
