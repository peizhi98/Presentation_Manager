import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {ActivatedRoute} from '@angular/router';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';

@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  styleUrls: ['./presentation-list.component.css']
})
export class PresentationListComponent implements OnInit {
  // @Input() scheduleId: number;
  routeConstant = RouteConstant;
  presentationModels = [];
  dataSource: MatTableDataSource<PresentationModel>;
  displayedColumns = ['number', 'studentName', 'title', 'sv'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  constructor(private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private loadingUtil: LoadingDialogUtil, private presentationService: PresentationService) {
  }

  ngOnInit(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.scheduleId$.subscribe(id => {
      console.log(id);
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
    console.log('init table');
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

}
