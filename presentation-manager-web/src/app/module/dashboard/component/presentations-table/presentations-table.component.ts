import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {Constant} from '../../../../../assets/constant/app.constant';

@Component({
  selector: 'app-presentations-table',
  templateUrl: './presentations-table.component.html',
  styleUrls: ['./presentations-table.component.css']
})
export class PresentationsTableComponent implements OnInit {
  routeConstant = RouteConstant;
  timeFormat = Constant.TIME_FORMAT;

  dataSource: MatTableDataSource<PresentationModel>;
  displayedColumns = ['number', 'studentName', 'time', 'schedule', 'year', 'sem', 'action'];

  @ViewChild(MatPaginator, {static: false}) set paginator(matPaginator: MatPaginator) {
    this.dataSource.paginator = matPaginator;
  }

  @ViewChild(MatSort, {static: false}) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @Input() presentations: PresentationModel[];

  constructor() {
  }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource(this.presentations);
    this.setFilterPredicate();
    this.initSortingAccessor();
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
          return item.startTime;
        case this.displayedColumns[3]:
          return item.scheduleModel.title;
        case this.displayedColumns[4]:
          return item.scheduleModel.year;
        case this.displayedColumns[5]:
          return item.scheduleModel.sem;
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

  getPaginatorOptions() {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
  }
}
