package com.fyp.presentationmanager.service.google;

import com.fyp.presentationmanager.model.google.CalendarEventModel;

public interface GoogleAPIService {
    String addGoogleCalendarEvent(CalendarEventModel calendarEventModel);
}
