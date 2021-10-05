package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.PresentationPanelBean;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PanelRepo extends JpaRepository<PresentationPanelBean, Integer> {
}
