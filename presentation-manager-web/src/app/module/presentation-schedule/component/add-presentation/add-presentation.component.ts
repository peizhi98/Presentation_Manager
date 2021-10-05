import {Component, Input, OnInit} from '@angular/core';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PanelModel} from '../../../../model/role/panel.model';

@Component({
  selector: 'app-add-presentation',
  templateUrl: './add-presentation.component.html',
  styleUrls: ['./add-presentation.component.css']
})
export class AddPresentationComponent implements OnInit {
  presentationModels: PresentationModel[] = [];
  @Input() scheduleId: number;

  constructor(private presentationService: PresentationService, private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.addForm();
  }

  addForm(): void {
    const presentationModel = new PresentationModel();
    presentationModel.scheduleId = this.scheduleId;
    presentationModel.panelModels = [];
    presentationModel.panelModels.push(new PanelModel());
    this.presentationModels.push(presentationModel);
  }

  removeForm(i: number): void {
    if (this.presentationModels.length > 1) {
      this.presentationModels.forEach((element, index) => {
        if (index === i) {
          this.presentationModels.splice(index, 1);
        }
      });
    }
  }

  addPanel(presentationModel: PresentationModel): void {
    presentationModel.panelModels.push(new PanelModel());
  }

  removePanel(panelModels: PanelModel[], i: number): void {
    if (panelModels.length > 1) {
      panelModels.forEach((element, index) => {
        if (index === i) {
          panelModels.splice(index, 1);
        }
      });
    }
  }

  save(): void {
    console.log(this.presentationModels);
    this.presentationService.addPresentationList(this.presentationModels).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        this.openSnackBar('Successfully Added Presentations.');
        this.presentationModels = [];
        this.addForm();
      } else {
        this.openSnackBar('Failed to Add Presentations.');
      }
    });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }


  DataFromEventEmitter(data): void {
    const presentationModelList: PresentationModel[] = [];
    console.log(data);
    data.forEach(d => {
      const presentation = new PresentationModel();
      presentation.scheduleId = this.scheduleId;
      presentation.supervisorId = d['Supervisor Um Mail'];
      presentation.title = d['Project Title'];
      presentation.studentEmail = d['Student Siswamail'];
      presentation.panelModels = [];
      presentationModelList.push(presentation);
    });
    this.presentationModels = presentationModelList;
  }

}
