package com.fyp.presentationmanager.service.google;

import com.fyp.presentationmanager.model.google.CalendarEventModel;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.Preconditions;
import com.google.api.client.util.Strings;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleAPIServiceImpl implements GoogleAPIService {
    private static final String APPLICATION_NAME = "Presentation Manager";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    //service account
    private static final String SERVICE_ACCOUNT = "presentation-manager@hazel-delight-330114.iam.gserviceaccount.com";
    private static final String KEY_FILE_PATH = "/auth.p12";
    static URL url = GoogleAPIServiceImpl.class.getResource("/auth.p12");
    static File keyFile = new File(url.getPath());

    /**
     * Global instance of the scopes required by this quickstart.
     * If modifying these scopes, delete your previously saved tokens/ folder.
     */
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

    @Override
    public String addGoogleCalendarEvent(CalendarEventModel calendarEventModel) {
        try {
            // Build a new authorized API client service.
            final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            Calendar service = new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            // List the next 10 events from the primary calendar.
            DateTime now = new DateTime(System.currentTimeMillis());
//            Events events = null;
//            events = service.events().list("primary")
//                    .setMaxResults(10)
//                    .setTimeMin(now)
//                    .setOrderBy("startTime")
//                    .setSingleEvents(true)
//                    .execute();
//            List<Event> items = events.getItems();
//            if (items.isEmpty()) {
//                System.out.println("No upcoming events found.");
//            } else {
//                System.out.println("Upcoming events");
//                for (Event event : items) {
//                    DateTime start = event.getStart().getDateTime();
//                    if (start == null) {
//                        start = event.getStart().getDate();
//                    }
//                    System.out.printf("%s (%s)\n", event.getSummary(), start);
//                }
//            }
            Event event = new Event()
                    .setSummary("Google I/O 2015")
                    .setLocation("800 Howard St., San Francisco, CA 94103")
                    .setDescription("A chance to hear more about Google's developer products.");

//            DateTime startDateTime = new DateTime("2021-10-28T09:00:00-07:00");
//            EventDateTime start = new EventDateTime()
//                    .setDateTime(startDateTime)
//                    .setTimeZone("America/Los_Angeles");
//            event.setStart(start);
//
//            DateTime endDateTime = new DateTime("2021-10-28T17:00:00-07:00");
//            EventDateTime end = new EventDateTime()
//                    .setDateTime(endDateTime)
//                    .setTimeZone("America/Los_Angeles");
//            event.setEnd(end);
            DateTime startDateTime = new DateTime(calendarEventModel.getStartTime().getTime());
            EventDateTime start = new EventDateTime()
                    .setDateTime(startDateTime)
                    .setTimeZone("Asia/Kuala_Lumpur");
            event.setStart(start);

            DateTime endDateTime = new DateTime(calendarEventModel.getEndTime().getTime());
            EventDateTime end = new EventDateTime()
                    .setDateTime(endDateTime)
                    .setTimeZone("Asia/Kuala_Lumpur");
            event.setEnd(end);

//            String[] recurrence = new String[] {"RRULE:FREQ=DAILY;COUNT=2"};
//            event.setRecurrence(Arrays.asList(recurrence));

            EventAttendee[] attendees = new EventAttendee[]{
//                    new EventAttendee().setEmail("PresentationManager0@gmail.com"),
//                    new EventAttendee().setEmail("opzhi1998@gmail.com"),
                    new EventAttendee().setEmail("wif180064@siswa.um.edu.my"),
            };
            event.setAttendees(Arrays.asList(attendees));

            EventReminder[] reminderOverrides = new EventReminder[]{
                    new EventReminder().setMethod("email").setMinutes(24 * 60),
                    new EventReminder().setMethod("popup").setMinutes(10),
            };
            Event.Reminders reminders = new Event.Reminders()
                    .setUseDefault(false)
                    .setOverrides(Arrays.asList(reminderOverrides));
            event.setReminders(reminders);

            //google meet
            ConferenceSolutionKey conferenceSKey = new ConferenceSolutionKey();
//            conferenceSKey.setType("eventHangout"); // Non-G suite user
            conferenceSKey.setType("hangoutsMeet");
            CreateConferenceRequest createConferenceReq = new CreateConferenceRequest();
            createConferenceReq.setRequestId("3whatisup3"); // ID generated by you
            createConferenceReq.setConferenceSolutionKey(conferenceSKey);
            ConferenceData conferenceData = new ConferenceData();
            conferenceData.setCreateRequest(createConferenceReq);
            event.setConferenceData(conferenceData);

            String calendarId = "primary";
//            event = service.events().insert("PresentationManager0@gmail.com", event).execute();
            event = service.events().insert(calendarId, event).setConferenceDataVersion(1).execute();
            System.out.printf("Event created: %s\n", event.getHtmlLink());
            System.out.println(event.getCreator());
            System.out.println(event.getId());
            System.out.println(event.getOrganizer());
            System.out.println(event.getConferenceData().getConferenceId());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Creates an authorized Credential object.
     *
     * @param HTTP_TRANSPORT The network HTTP Transport.
     * @return An authorized Credential object.
     * @throws IOException If the credentials.json file cannot be found.
     */
    private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // Load client secrets.
        InputStream in = GoogleAPIServiceImpl.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    private static Credential getServiceAccCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        Credential credential;

        Preconditions.checkArgument(!Strings.isNullOrEmpty(APPLICATION_NAME),
                "applicationName cannot be null or empty!");
        try {
//            HttpTransport TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            HttpTransport TRANSPORT = HTTP_TRANSPORT;

            credential = new GoogleCredential.Builder().setTransport(TRANSPORT)
                    .setJsonFactory(JSON_FACTORY)
                    .setServiceAccountId(SERVICE_ACCOUNT)
                    .setServiceAccountScopes(Collections.singleton(CalendarScopes.CALENDAR))
                    .setServiceAccountPrivateKeyFromP12File(keyFile)

                    .build();
            credential.refreshToken();
//            Calendar client = new com.google.api.services.calendar.Calendar.Builder(TRANSPORT, JSON_FACTORY, credential)
//                    .setApplicationName(APPLICATION_NAME).build();
            return credential;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
//    private static final String APPLICATION_NAME = "Presentation Manager";
//    private static HttpTransport httpTransport;
//    private static final JsonFactory JSON_FACTORY = new JacksonFactory();
//    private static com.google.api.services.calendar.Calendar client;
//    Class a = getClass();
//    URL url = getClass().getResource("/hazel-delight-330114-d820ca4c2c68.p12");
//    File keyFile = new File("D:\\IdeaProjects\\PresentationManager\\presentationmanager\\src\\main\\java\\hazel-delight-330114-d820ca4c2c68.p12");
//    GoogleClientSecrets clientSecrets;
//    GoogleAuthorizationCodeFlow flow;
//    Credential credential;
//
//    HttpTransport TRANSPORT;
//    private String SERVICE_ACCOUNT = "presentation-manager@hazel-delight-330114.iam.gserviceaccount.com";
//
//    @Override
//    public String addGoogleCalendarEvent(CalendarEventModel calendarEventModel) {
//        com.google.api.services.calendar.model.Events eventList;
//        String message;
//
//// 			TokenResponse response = flow.newTokenRequest(code).setRedirectUri(redirectURI).execute();
//// 			credential = flow.createAndStoreCredential(response, "userID"); //for Oauth2
//        Preconditions.checkArgument(!Strings.isNullOrEmpty(APPLICATION_NAME),
//                "applicationName cannot be null or empty!");
//        try {
//            TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
//
//
//            credential = new GoogleCredential.Builder().setTransport(TRANSPORT)
//                    .setJsonFactory(JSON_FACTORY)
//                    .setServiceAccountId(SERVICE_ACCOUNT)
//                    .setServiceAccountScopes(Collections.singleton(CalendarScopes.CALENDAR))
//                    .setServiceAccountPrivateKeyFromP12File(keyFile)
//
//                    .build();
//            credential.refreshToken();
//            client = new com.google.api.services.calendar.Calendar.Builder(TRANSPORT, JSON_FACTORY, credential)
//                    .setApplicationName(APPLICATION_NAME).build();
//            System.out.println(client);
//            Events events = client.events();
////            eventList = events.list("primary").setTimeMin(date1).setTimeMax(date2).execute();
////            message = eventList.getItems().toString();
//
//            Event event = new Event()
//                    .setSummary("Google I/O 2015")
//                    .setLocation("800 Howard St., San Francisco, CA 94103")
//                    .setDescription("A chance to hear more about Google's developer products.");
//
//            DateTime startDateTime = new DateTime("2021-07-31T09:00:00-07:00");
//            EventDateTime start = new EventDateTime()
//                    .setDateTime(startDateTime)
//                    .setTimeZone("America/Los_Angeles");
//            event.setStart(start);
//
//            DateTime endDateTime = new DateTime("2021-08-01T17:00:00-07:00");
//            EventDateTime end = new EventDateTime()
//                    .setDateTime(endDateTime)
//                    .setTimeZone("America/Los_Angeles");
//            event.setEnd(end);
//
//            String[] recurrence = new String[]{"RRULE:FREQ=DAILY;COUNT=2"};
//            event.setRecurrence(Arrays.asList(recurrence));
//			EventAttendee[] attendees = new EventAttendee[] {
// 				    new EventAttendee().setEmail("opzhi1998@gmail.com"),
////				    new EventAttendee().setEmail("himanshuranjan3030@gmail.com"),
//				};
//		event.setAttendees(Arrays.asList(attendees));
//
//            EventReminder[] reminderOverrides = new EventReminder[]{
//                    new EventReminder().setMethod("email").setMinutes(24 * 60),
//                    new EventReminder().setMethod("popup").setMinutes(10),
//            };
//            Event.Reminders reminders = new Event.Reminders()
//                    .setUseDefault(false)
//                    .setOverrides(Arrays.asList(reminderOverrides));
//            event.setReminders(reminders);
//
//            String calendarId = "primary";
//            event = client.events().insert("opzhi1998@gmail.com", event).execute();
//            System.out.printf("Event created: %s\n", event.getHtmlLink());
//
//
////            System.out.println("cal message:" + message);
//            return null;
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
}
