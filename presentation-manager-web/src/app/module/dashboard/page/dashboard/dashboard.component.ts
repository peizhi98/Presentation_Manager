import {Component, OnInit, ViewChild} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatTableDataSource} from '@angular/material/table';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {ScheduleModel, ScheduleType} from '../../../../model/schedule/schedule.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ScheduleService} from '../../../../service/schedule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemRole} from '../../../../model/user/user.model';
import {NgxPermissionsService} from 'ngx-permissions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firstLoadPaneling = true;
  panelingPresentations: PresentationModel[];

  firstLoadSupervising = true;
  supervisingPresentations: PresentationModel[];

  firstLoadPresiding = true;
  presidingPresentations: PresentationModel[];

  scheduleList: ScheduleModel[] = [];
  routeConstant = RouteConstant;

  dataSource: MatTableDataSource<ScheduleModel>;
  displayedColumns = ['number', 'title', 'academic year', 'sem', 'type'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private presentationService: PresentationService,
              private loadingDialogUtil: LoadingDialogUtil,
              private scheduleService: ScheduleService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private ngxPermission: NgxPermissionsService) {
  }

  ngOnInit(): void {
    // if (this.ngxPermission.hasPermission(SystemRole.OFFICE)) {
    //   const dialogRef = this.loadingDialogUtil.openLoadingDialog();
    //   this.scheduleService.getSchedules().subscribe(resp => {
    //     if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
    //       console.log(resp);
    //       this.scheduleList = resp.data;
    //       this.initTable();
    //       dialogRef.close();
    //     }
    //   });
    // }
    this.getMasterSchedule();

  }

  getMasterSchedule() {
    // const dialogRef = this.loadingDialogUtil.openLoadingDialog();
    this.scheduleService.getMasterSchedules().subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        console.log(resp);
        this.scheduleList = resp.data;
        this.initTable();
        // dialogRef.close();
      }
    });
  }

  loadPanelingPresentations(): void {
    if (this.firstLoadPaneling) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsPanel().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.panelingPresentations = resp.data;
          this.firstLoadPaneling = false;
          loading.close();
        }
      });
    }

  }

  loadSupervisingPresentations(): void {
    if (this.firstLoadSupervising) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsSupervisor().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.supervisingPresentations = resp.data;
          this.firstLoadSupervising = false;
          loading.close();
        }
      });
    }
  }

  loadPresidingPresentations(): void {
    if (this.firstLoadPresiding) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsChairperson().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.presidingPresentations = resp.data;
          this.firstLoadPresiding = false;
          loading.close();
        }
      });
    }
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource(this.scheduleList);
    this.setFilterPredicate();
    this.initSortingAccessor();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
          return item.title;
        case this.displayedColumns[2]:
          return item.year;
        case this.displayedColumns[3]:
          return item.sem;
        case this.displayedColumns[4]:
          return item.scheduleType;
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


  routeToSchedule(id: number): void {
    this.router.navigate(['/' + RouteConstant.SCHEDULE_VIEW + '/' + id + '/' + RouteConstant.PRESENTATION_VIEW]);
  }

  getScheduleType(type: ScheduleType): string {
    return (type === ScheduleType.FYP) ? 'FYP' : 'Master';
  }

  get SystemRole() {
    return SystemRole;
  }


}
