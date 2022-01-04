import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {RouteConstant} from '../../../../../assets/constant/route.contant';

@Component({
  selector: 'app-presentations-table',
  templateUrl: './presentations-table.component.html',
  styleUrls: ['./presentations-table.component.css']
})
export class PresentationsTableComponent implements OnInit {
  routeConstant = RouteConstant;

  dataSource: MatTableDataSource<PresentationModel>;
  displayedColumns = ['number', 'studentName', 'title', 'sv', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  getPaginatorOptions() {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
  }
}
