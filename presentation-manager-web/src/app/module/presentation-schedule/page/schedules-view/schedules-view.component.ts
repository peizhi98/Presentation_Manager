import {Component, OnInit, ViewChild} from '@angular/core';
import {ScheduleService} from '../../../../service/schedule.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ScheduleModel, ScheduleType} from '../../../../model/schedule/schedule.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './schedules-view.component.html',
  styleUrls: ['./schedules-view.component.css']
})
export class SchedulesViewComponent implements OnInit {
  scheduleList: ScheduleModel[] = [];
  routeConstant = RouteConstant;

  dataSource: MatTableDataSource<ScheduleModel>;
  displayedColumns = ['number', 'title', 'academic year', 'sem', 'type'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private scheduleService: ScheduleService,
              private router: Router,
              private dialogUtil: LoadingDialogUtil,
              private store: Store,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const dialogRef = this.dialogUtil.openLoadingDialog();
    this.scheduleService.getSchedules().subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        console.log(resp);
        this.scheduleList = resp.data;
        this.initTable();
        dialogRef.close();
      }

    });
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
    this.router.navigate([id + '/' + RouteConstant.PRESENTATION_VIEW], {relativeTo: this.activatedRoute});
  }

  getScheduleType(type: ScheduleType): string {
    return (type === ScheduleType.FYP) ? 'FYP' : 'Master';
  }

  get SystemRole() {
    return SystemRole;
  }

}
