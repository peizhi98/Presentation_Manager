package com.fyp.presentationmanager.entity;

import com.fyp.presentationmanager.enums.EvaluationType;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "presentation_panel")
public class PresentationPanelBean implements Serializable {
    public static final String ID = "id";
    public static final String PANEL_ID = "panel_id";
    public static final String PRESENTATION_ID = "presentation_id";
    private static final long serialVersionUID = 925785039632596700L;

    @Id
    @Column(name = ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = PANEL_ID, nullable = false)
    private Integer panelId;

    @Column(name = PRESENTATION_ID, nullable = false)
    private Integer presentationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = PANEL_ID, referencedColumnName = UserBean.ID, insertable = false, updatable = false)
    private UserBean panelBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = PRESENTATION_ID, referencedColumnName = PresentationBean.ID, insertable = false, updatable = false)
    private PresentationBean presentationBean;

    public PresentationPanelBean() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPanelId() {
        return panelId;
    }

    public void setPanelId(Integer panelEMail) {
        this.panelId = panelEMail;
    }

    public Integer getPresentationId() {
        return presentationId;
    }

    public void setPresentationId(Integer presentationId) {
        this.presentationId = presentationId;
    }

    public PresentationBean getPresentationBean() {
        return presentationBean;
    }

    public void setPresentationBean(PresentationBean presentationBean) {
        this.presentationBean = presentationBean;
    }

    public UserBean getPanelBean() {
        return panelBean;
    }

    public void setPanelBean(UserBean panelBean) {
        this.panelBean = panelBean;
    }

    public EvaluationFormBean getEvaluationFormOf(EvaluationType evaluationType) {
        return this.presentationBean.getEvaluationFormOf(evaluationType);
    }
}
