import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EvaluationFormService} from '../../service/evluation-form.service';
import {EvaluationFormModel, EvaluationType} from '../../model/evaluation-form.model';
import {Constant} from '../../../assets/constant/app.constant';
import {CriteriaModel} from '../../model/criteria.model';
import {MatTable} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-evaluation-criteria',
  templateUrl: './evaluation-criteria.component.html',
  styleUrls: ['./evaluation-criteria.component.css']
})
export class EvaluationCriteriaComponent implements OnInit {
  displayedColumns: string[] = ['position', 'criteria', 'weightage', 'max', 'delete'];
  @ViewChild(MatTable) table: MatTable<CriteriaModel>;
  @Input() scheduleId: number;
  evaluationFormModel: EvaluationFormModel;
  criteriaModels: CriteriaModel[] = [];
  fypEvaluationType = [EvaluationType.PRESENTATION, EvaluationType.REPORT];
  selectedEvaluationType = this.fypEvaluationType[0];

  constructor(private evaluationFormService: EvaluationFormService, private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadEvaluationForm(this.fypEvaluationType[0]);
  }

  loadEvaluationForm(evaluationType: EvaluationType): void {
    this.evaluationFormService.getEvaluationForm(this.scheduleId, evaluationType)
      .subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.evaluationFormModel = resp.data;

          if (!this.evaluationFormModel.id) {
            this.evaluationFormModel.evaluationType = this.selectedEvaluationType;
            this.evaluationFormModel.scheduleId = this.scheduleId;
            this.evaluationFormModel.criteriaModels = [];
            console.log(this.evaluationFormModel);
          }
          this.criteriaModels = this.evaluationFormModel.criteriaModels;
        }
        console.log(this.evaluationFormModel);
      });
  }

  addCriteria(): void {
    const criteriaModel = new CriteriaModel();
    criteriaModel.criteriaOrder = this.criteriaModels.length + 1;
    this.criteriaModels.push(criteriaModel);
    this.table.renderRows();
    console.log(this.criteriaModels);
  }

  removeCriteria(i: number): void {
    console.log(this.criteriaModels);
    if (this.criteriaModels.length > 1) {
      this.criteriaModels.forEach((element, index) => {
        if (index === i) {
          this.criteriaModels.splice(index, 1);
        }
      });
    }
    this.table.renderRows();
  }

  isFypPresentation(): boolean {
    return this.selectedEvaluationType === EvaluationType.PRESENTATION;
  }

  save(): void {
    console.log(this.evaluationFormModel);
    this.evaluationFormService
      .addOrEditEvaluationForm(this.evaluationFormModel)
      .subscribe(resp => {
        console.log(resp);
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.openSnackBar('Successfully Save Evaluation Criteria');
        }
      });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

}
