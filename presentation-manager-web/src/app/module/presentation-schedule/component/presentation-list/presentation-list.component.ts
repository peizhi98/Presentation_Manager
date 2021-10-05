import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';

@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  styleUrls: ['./presentation-list.component.css']
})
export class PresentationListComponent implements OnInit {
  @Input() scheduleId: number;
  presentationModels = [];
  dataSource: MatTableDataSource<PresentationModel>;
  displayedColumns = ['number', 'studentName', 'title', 'sv'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private cdr: ChangeDetectorRef, private presentationService: PresentationService) {
  }

  ngOnInit(): void {
    this.presentationService.getPresentations(this.scheduleId).subscribe(res => {
      if (res.data && res.status === Constant.RESPONSE_SUCCESS) {
        this.presentationModels = res.data;
        this.initTable();
      }
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
