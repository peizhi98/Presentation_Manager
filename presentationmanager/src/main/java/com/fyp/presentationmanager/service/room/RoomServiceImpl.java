package com.fyp.presentationmanager.service.room;

import com.fyp.presentationmanager.entity.RoomBean;
import com.fyp.presentationmanager.model.room.RoomModel;
import com.fyp.presentationmanager.repo.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    @Autowired
    private RoomRepo roomRepo;

    @Override
    public List<RoomModel> getAllRooms() {
        List<RoomBean> roomBeans = this.roomRepo.findAll();
        List<RoomModel> roomModels = new ArrayList<>();
        if (roomBeans != null) {
            for (RoomBean roomBean : roomBeans) {
                RoomModel roomModel = new RoomModel();
                roomModel.setId(roomBean.getId());
                roomModel.setName(roomBean.getName());
                roomModels.add(roomModel);
            }
        }
        return roomModels;
    }
}
