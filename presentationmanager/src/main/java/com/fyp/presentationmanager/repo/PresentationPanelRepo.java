package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.PresentationPanelBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresentationPanelRepo  extends JpaRepository<PresentationPanelBean, Integer> {

}
