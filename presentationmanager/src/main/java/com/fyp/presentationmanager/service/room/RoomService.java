package com.fyp.presentationmanager.service.room;

import com.fyp.presentationmanager.model.room.RoomModel;
import com.fyp.presentationmanager.repo.RoomRepo;
import com.fyp.presentationmanager.repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RoomService {
    List<RoomModel> getAllRooms();
}
