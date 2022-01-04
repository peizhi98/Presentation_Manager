package com.fyp.presentationmanager.repo;

import com.fyp.presentationmanager.entity.PresentationPanelBean;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PanelRepo extends JpaRepository<PresentationPanelBean, Integer> {
    List<PresentationPanelBean> findPresentationPanelBeansByPanelId(Integer id);
}
