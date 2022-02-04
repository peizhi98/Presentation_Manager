import {Component, OnDestroy, OnInit} from '@angular/core';
import {CriterionEvaluationReportModel} from '../../../../model/evaluation/evaluation-report';
import {MatTableDataSource} from '@angular/material/table';
import {EvaluationService} from '../../../../service/evaluation.service';
import {EvaluationReportService} from '../../../../service/evaluation-report.service';
import {EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Observable, Subscription} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {PresentationState} from '../../../../store/presentation/presentation.store';
import {ActivatedRoute, Router} from '@angular/router';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {SystemRole} from '../../../../model/user/user.model';
import * as XLSX from 'xlsx';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';

@Component({
  selector: 'app-presentation-evalaution-report',
  templateUrl: './presentation-evalaution-report.component.html',
  styleUrls: ['./presentation-evalaution-report.component.css']
})
export class PresentationEvalautionReportComponent implements OnInit, OnDestroy {
  presentationId: number;
  presentationModel: PresentationModel;
  evaluationType: EvaluationType;
  criterionEvaluationReportModels: CriterionEvaluationReportModel[];
  dataSource: MatTableDataSource<CriterionEvaluationReportModel>;
  displayedColumns: string[] = ['criteria', 'weightage'];
  panelsIndexColumns: number[] = [];
  panelsName: string[] = [];

  @Select(PresentationState.getPresentationId)
  presentationId$: Observable<number>;

  @Select(PresentationState.getPresentationModel)
  presentationModel$: Observable<PresentationModel>;
  subs: Subscription[] = [];

  constructor(private evaluationService: EvaluationService,
              private evaluationReportService: EvaluationReportService,
              private activatedRoute: ActivatedRoute,
              private store: Store,
              private router: Router,
              private loadingutil: LoadingDialogUtil) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
    this.store.dispatch(new ChangeEvaluationType(null));
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if (params) {
        this.evaluationType = params.form;
        this.initTable();
      }
    });


    this.subs.push(this.presentationId$.subscribe(pId => {
      if (pId) {
        this.presentationId = pId;
        this.initTable();
      }
    }));


  }

  initTable() {
    if (this.presentationId && this.evaluationType) {
      console.log('generating report...');
      const loadingRef = this.loadingutil.openLoadingDialog();
      this.evaluationReportService.getPresentationEvaluationsOfType(this.evaluationType, this.presentationId).subscribe(resp => {
        this.displayedColumns = ['criteria', 'weightage'];
        this.panelsIndexColumns = [];
        this.panelsName = [];
        this.criterionEvaluationReportModels = [];
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          console.log(resp.data);
          this.criterionEvaluationReportModels = resp.data;
          this.criterionEvaluationReportModels[0].evaluatorCriterionEvaluationModels.forEach((e, index) => {
            this.panelsIndexColumns.push(index);
            this.displayedColumns.push(index.toString() + 'score');
            this.displayedColumns.push(index.toString() + 'comment');
            this.panelsName.push(e.evaluatorName);
          });
          console.log(this.displayedColumns);
          console.log(this.panelsIndexColumns);
          this.dataSource = new MatTableDataSource(this.criterionEvaluationReportModels);
        } else {
          this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
          this.store.dispatch(new ShowSnackBar('Failed to retrieve report.' + resp.message));
        }
        loadingRef.close();
      });

    }
  }

  getScoreMatColumnDef(i: number): string {
    return i.toString() + 'score';
  }

  getCommentMatColumnDef(i: number): string {
    return i.toString() + 'comment';
  }

  handleNullDisplay(str: string): string {
    if (str) {
      return str;
    } else {
      return '-';
    }
  }

  getTitle(): string {
    let title = '';
    switch (this.evaluationType) {
      case EvaluationType.PRESENTATION:
        title = 'VIVA Assessment Form';
        break;
      case EvaluationType.REPORT:
        title = 'Supervisor Assessment Form';
        break;
      case EvaluationType.PANEL:
        title = 'Evaluation Form';
        break;
      case EvaluationType.CONFIRMATION:
        title = 'Confirmation Panel Evaluation Form';
        break;
      default:
        title = 'Invalid Form Name';
    }
    return title + ' Report';
  }

  getScoreDisplay(score: number): string {
    if (this.evaluationType === EvaluationType.CONFIRMATION) {
      return this.getConfirmationScaleName(score);
    }
    return (score) ? score.toString() : '-';
  }

  getConfirmationScaleName(scale: number): string {
    switch (scale) {
      case 0:
        return 'Fail/ Repeat';
      case 1:
        return 'Good/Pass';
      case 2:
        return 'Excellent/Pass';
      default:
        return '-';
    }
  }

  exportexcel(): void {
    /* pass here the table id */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const p: PresentationModel = this.store.selectSnapshot(PresentationState.getPresentationModel);
    const fileName = this.getTitle() + ' of ' + p.studentMatrixNo;
    console.log(fileName);
    /* save to file */
    XLSX.writeFile(wb, fileName + '.xlsx');

  }

  get SystemRole() {
    return SystemRole;
  }
}
