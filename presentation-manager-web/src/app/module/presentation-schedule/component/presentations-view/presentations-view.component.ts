import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {SystemRole} from '../../../../model/user/user.model';
import * as XLSX from 'xlsx';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {PanelModel} from '../../../../model/role/panel.model';

@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentations-view.component.html',
  styleUrls: ['./presentations-view.component.css']
})
export class PresentationsViewComponent implements OnInit, OnDestroy {
  // @Input() scheduleId: number;
  timeFormat = Constant.TIME_FORMAT;
  routeConstant = RouteConstant;
  constant = Constant;
  presentationModels = [];
  dataSource: MatTableDataSource<PresentationModel>;
  scheduleId: number;
  scheduleType: ScheduleType;
  displayedColumns = ['number', 'studentName', 'title', 'sv','panels' ,'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;
  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;
  @Select(ScheduleState.getScheduleTitle)
  scheduleTitle$: Observable<string>;

  subs: Subscription[] = [];


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private loadingUtil: LoadingDialogUtil,
              private presentationService: PresentationService,
              private store: Store) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subs.push(this.scheduleType$.subscribe(t => {
      this.scheduleType = t;
    }));
    this.subs.push(this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      const loadingRef = this.loadingUtil.openLoadingDialog();
      this.presentationService.getPresentations(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          this.presentationModels = res.data;
          this.initTable();
          loadingRef.close();
        }
      });
    }));
  }

  initTable(): void {
    // no ngIf in table! paginator and sorting will not work
    this.dataSource = new MatTableDataSource(this.presentationModels);
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
          return item.studentName;
        case this.displayedColumns[2]:
          return item.title;
        case this.displayedColumns[3]:
          return item.supervisorModel.name;
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

  test(e, id) {
    console.log(e.target);
    console.log(e.target.tagName);
    if (e.target.tagName === 'MAT-ICON' || e.target.tagName === 'BUTTON') {
      console.log('The button was clicked');
    } else {
      this.router.navigate([id], {relativeTo: this.activatedRoute});
    }

  }

  getPaginatorOptions() {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
  }

  get SystemRole() {
    return SystemRole;
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = this.store.selectSnapshot(ScheduleState.getScheduleTitle);
    console.log(fileName);
    /* save to file */
    XLSX.writeFile(wb, fileName + '.xlsx');

  }

  isFyp(): boolean {
    return this.scheduleType === ScheduleType.FYP;
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  getPanelsListString(panels: PanelModel[]): string {
    let str = '';
    if (panels && panels.length !== 0) {
      panels.forEach((p, index) => {
        if (index === 0) {
          str = str + p.name;
        } else {
          str = str + ', ' + p.name;
        }
      });
      return str;
    } else {
      return '-';
    }
  }
}
