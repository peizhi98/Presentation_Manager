import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {PresentationService} from '../../../../service/presentation.service';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {Constant} from '../../../../../assets/constant/app.constant';
import {SystemRole} from '../../../../model/user/user.model';
import {ShowSnackBar} from '../../../../store/app/app.action';

@Component({
  selector: 'app-google-integration',
  templateUrl: './google-integration.component.html',
  styleUrls: ['./google-integration.component.css']
})
export class GoogleIntegrationComponent implements OnInit {
  timeFormat = Constant.TIME_FORMAT;
  presentationModels = [];
  dataSource: MatTableDataSource<PresentationModel>;
  scheduleId: number;
  displayedColumns = ['studentName', 'scheduledTime', 'googleCalendarTime', 'googleMeetLink', 'lastSync', 'sync'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private loadingUtil: LoadingDialogUtil,
              private presentationService: PresentationService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
      const loadingRef = this.loadingUtil.openLoadingDialog();
      this.presentationService.getPresentations(id).subscribe(res => {
        if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
          this.presentationModels = res.data;
          this.initTable();
          loadingRef.close();
        }
      });
    });
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
          return item.studentName;
        case this.displayedColumns[1]:
          return item.startTime;
        case this.displayedColumns[2]:
          return item.calendarStartTime;
        case this.displayedColumns[3]:
          return item.googleMeetLink;
        case this.displayedColumns[4]:
          return item.lastSync;
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

  syncAllPresentations(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Syncing all presentation.Please wait...');
    this.presentationService.syncAllPresentationWithGoogleCalendar(this.scheduleId).subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        loadingRef.close();
        this.ngOnInit();
        this.store.dispatch(new ShowSnackBar('Successfully sync ' + res.data.length + ' presentations'));
      } else {
        loadingRef.close();
        this.store.dispatch(new ShowSnackBar('Failed to sync all presentation'));
      }
    });
  }

  syncPresentations(id: number): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Syncing presentation...');
    this.presentationService.syncPresentationWithGoogleCalendar(id).subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        loadingRef.close();
        this.store.dispatch(new ShowSnackBar('Successfully sync presentation'));
        this.ngOnInit();
      } else {
        loadingRef.close();
        this.store.dispatch(new ShowSnackBar('Failed to sync presentation'));
      }
    });
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

}
