import {Component, OnInit, ViewChild} from '@angular/core';
import {FypEvaluationOverviewModel, FypPresentationEvaluationOverviewModel} from '../../../../model/evaluation/evaluation-report';
import {Select} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {EvaluationReportService} from '../../../../service/evaluation-report.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {ChartDataSets} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';


@Component({
  selector: 'app-evaluation-report-fyp',
  templateUrl: './evaluation-report-fyp.component.html',
  styleUrls: ['./evaluation-report-fyp.component.css']
})
export class EvaluationReportFypComponent implements OnInit {
  // @Input() scheduleId: number;
  selectedView = 'table';
  fypEvaluationOverviewModel: FypEvaluationOverviewModel;
  presentationEvaluations: FypPresentationEvaluationOverviewModel[] = [];
  // table
  displayedColumns: string[] = ['number', 'studentName', 'title', 'reportScore', 'presentationScore', 'total'];
  dataSource: MatTableDataSource<FypPresentationEvaluationOverviewModel> = new MatTableDataSource<FypPresentationEvaluationOverviewModel>();

  @ViewChild(MatPaginator, {static: false}) set paginator(matPaginator: MatPaginator) {
    this.dataSource.paginator = matPaginator;
  }

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  // chart
  @ViewChild('baseChart')
  chart: BaseChartDirective;
  chartData: ChartDataSets[];
  chartLabels: Label[];
  chartHeight: number;
  xAxisMax: number;

  chartOptions = {
    // scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          position: 'top',
          stacked: true,
          ticks: {
            stepSize: 1,
            max: this.xAxisMax,
          }
        }
      ],
      yAxes: [
        {
          barThickness: 10,
          stacked: true,
        }
      ]
    }
  };

  chartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(54, 162, 235)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgb(75, 192, 192)',
    },
  ];

  chartLegend = true;
  chartPlugins = [];
  chartType = 'horizontalBar';
  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  constructor(private evaluationReportService: EvaluationReportService, private loadingUtil: LoadingDialogUtil) {
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      if (id) {
        const loadingRef = this.loadingUtil.openLoadingDialog();
        this.evaluationReportService.getFypEvaluationReport(id).subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.fypEvaluationOverviewModel = resp.data;
            this.presentationEvaluations = this.fypEvaluationOverviewModel.fypPresentationEvaluationOverviewModels;
            this.initTable();
            const reportData: number[] = [];
            const presentationData: number[] = [];
            const labels: string[] = [];
            // tslint:disable-next-line:only-arrow-functions
            this.presentationEvaluations.sort(function(a, b) {
              return b.total - a.total;
            });
            if (this.presentationEvaluations) {
              this.presentationEvaluations.forEach(p => {
                reportData.push(p.reportScore);
                presentationData.push(p.presentationScore);
                labels.push(p.studentName);
              });
            }
            console.log(this.chartLabels);
            this.xAxisMax = this.fypEvaluationOverviewModel.total;
            this.chartHeight = this.presentationEvaluations.length * 20;
            this.chartData = [];
            this.chartData.push({data: presentationData, label: 'Presentation Score'});
            this.chartData.push({data: reportData, label: 'Report Score'});
            this.chartLabels = labels;
            // this.chart.update();
            console.log(this.chartData);
            console.log(this.chartLabels);
            loadingRef.close();
          }
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
          return this.dataSource.data.indexOf(item);
        case this.displayedColumns[1]:
          return item.studentName;
        case this.displayedColumns[2]:
          return item.title;
        case this.displayedColumns[3]:
          return item.reportScore;
        case this.displayedColumns[4]:
          return item.presentationScore;
        case this.displayedColumns[5]:
          return item.total;
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
    return (score) ? score : '-';
  }

  reportWeightage(): any {
    return (this.fypEvaluationOverviewModel) ? this.fypEvaluationOverviewModel.reportWeightage : '-';
  }

  presentationWeightage(): any {
    return (this.fypEvaluationOverviewModel) ? this.fypEvaluationOverviewModel.presentationWeightage : '-';
  }

  total(): any {
    return (this.fypEvaluationOverviewModel) ? this.fypEvaluationOverviewModel.total : '-';
  }

  getPaginatorOptions() {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
  }

  isTableView(): boolean {
    return this.selectedView === 'table';
  }

  isChartView(): boolean {
    return this.selectedView === 'chart';
  }
}
