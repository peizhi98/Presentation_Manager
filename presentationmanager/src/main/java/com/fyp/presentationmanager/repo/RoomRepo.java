package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.RoomBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepo extends JpaRepository<RoomBean, Integer> {
}
