package com.fyp.presentationmanager.model.scheduleGeneticAlgo.scheduleDNA;

import com.fyp.presentationmanager.model.room.RoomPresentationSlotsModel;
import com.fyp.presentationmanager.util.DateTimeUtil;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Room {
    private Integer id;
    private String name;
    private boolean allowMultiple;
    private List<TimeRange> meetingSlots;
    private List<TimeRange> blockTimeRange;

    public static Room buildAndInitMeetingSlots(RoomPresentationSlotsModel room, Integer duration) {
        Room gaRoom = new Room();
        gaRoom.setId(room.getId());
        gaRoom.setName(room.getName());
        List<TimeRange> meetingSlots = new ArrayList<>();
        gaRoom.setMeetingSlots(meetingSlots);
        if (room != null) {
            if (room.getName().equals("Online")) {
                gaRoom.setAllowMultiple(true);
            } else {
                gaRoom.setAllowMultiple(false);
            }

            if (room.getSlots() != null) {
                for (TimeRange tr : room.getSlots()) {
                    Date startTime = tr.getStartTime();
                    while (startTime.before(tr.getEndTime())) {
                        TimeRange meetingSlot = new TimeRange();
                        meetingSlot.setStartTime(startTime);
                        Date endTime = new Date(startTime.getTime() +
                                DateTimeUtil.minutesToMillis(duration));
                        meetingSlot.setEndTime(endTime);
                        meetingSlots.add(meetingSlot);
//                             set next start time
                        startTime = endTime;
                    }
                }
            }
        }

        return gaRoom;
    }
}
