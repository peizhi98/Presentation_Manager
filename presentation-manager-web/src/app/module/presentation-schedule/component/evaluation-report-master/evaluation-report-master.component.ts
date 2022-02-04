import {Component, OnInit, ViewChild} from '@angular/core';
import {Constant} from '../../../../../assets/constant/app.constant';
import {MatTableDataSource} from '@angular/material/table';
import {MasterEvaluationOverviewModel, MasterPresentationEvaluationOverviewModel} from '../../../../model/evaluation/evaluation-report';
import {EvaluationReportService} from '../../../../service/evaluation-report.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {ShowSnackBar} from '../../../../store/app/app.action';
import * as XLSX from 'xlsx';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {PresentationState} from '../../../../store/presentation/presentation.store';
import {MarkingSchemeDialogComponent} from '../../../../component/marking-scheme-dialog/marking-scheme-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation-report-master',
  templateUrl: './evaluation-report-master.component.html',
  styleUrls: ['./evaluation-report-master.component.css']
})
export class EvaluationReportMasterComponent implements OnInit {
  masterEvaluationOverviewModel: MasterEvaluationOverviewModel;
  presentationEvaluations: MasterPresentationEvaluationOverviewModel[] = [];
  // table
  displayedColumns: string[] = ['studentName', 'matrix', 'numOfPanels', 'evaluatedPanels', 'highest', 'lowest', 'diff', 'avg', 'percent', 'confirmation'];
  dataSource: MatTableDataSource<MasterPresentationEvaluationOverviewModel>
    = new MatTableDataSource<MasterPresentationEvaluationOverviewModel>();

  @ViewChild(MatPaginator, {static: false}) set paginator(matPaginator: MatPaginator) {
    this.dataSource.paginator = matPaginator;
  }

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  constructor(private dialog: MatDialog, private evaluationReportService: EvaluationReportService, private loadingUtil: LoadingDialogUtil, private store: Store) {
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      if (id) {
        const loadingRef = this.loadingUtil.openLoadingDialog();
        this.evaluationReportService.getMasterEvaluationReport(id).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.masterEvaluationOverviewModel = resp.data;
            this.presentationEvaluations = this.masterEvaluationOverviewModel.masterPresentationEvaluationOverviewModels;
            this.initTable();
            this.presentationEvaluations.sort(function(a, b) {
              return b.total - a.total;
            });

          } else {
            this.store.dispatch(new ShowSnackBar('Failed to generate evaluation report.'));
          }
          loadingRef.close();
        });
      }
    });
  }


  initTable(): void {
    this.dataSource.data = this.presentationEvaluations;
    this.setFilterPredicate();
    this.initSortingAccessor();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  setFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  // custom sorting accessor, MatTableDataSource use the column name to sort by default
  initSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case this.displayedColumns[0]:
          return item.studentName;
        case this.displayedColumns[1]:
          return item.matrix;
        case this.displayedColumns[2]:
          return item.numberOfPanels;
        case this.displayedColumns[3]:
          return item.numberOfPanelsEvaluated;
        case this.displayedColumns[4]:
          return item.highestEvaluationGivenByPanel;
        case this.displayedColumns[5]:
          return item.lowestEvaluationGivenByPanel;
        case this.displayedColumns[6]:
          return item.maxDifferenceInEvaluation;
        case this.displayedColumns[7]:
          return item.avgPanelEvaluationScore;
        case this.displayedColumns[8]:
          return item.totalInPercent;
        case this.displayedColumns[9]:
          return item.confirmationResult;
        default:
          return item[property];
      }
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  scoreDisplay(score: any): any {
    if (score === 0) {
      return 0;
    }
    return (score) ? score : '-';
  }

  presentationWeightage(): any {
    return (this.masterEvaluationOverviewModel) ? this.masterEvaluationOverviewModel.panelEvaluationWeightage : '-';
  }

  total(): any {
    return (this.masterEvaluationOverviewModel) ? this.masterEvaluationOverviewModel.total : '-';
  }

  getPaginatorOptions() {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
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
    const fileName = this.store.selectSnapshot(ScheduleState.getScheduleTitle) + ' Evaluation Report';
    console.log(fileName);
    /* save to file */
    XLSX.writeFile(wb, fileName + '.xlsx');

  }

  openMarkingScheme(): void {
    const dialogRef = this.dialog.open(MarkingSchemeDialogComponent);
  }

}
