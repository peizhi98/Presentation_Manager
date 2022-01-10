import {Component, OnInit, ViewChild} from '@angular/core';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {Store} from '@ngxs/store';
import {Constant} from '../../../../../assets/constant/app.constant';
import {UserService} from '../../../../service/user.service';
import {SystemRole, UserModel} from '../../../../model/user/user.model';
import {MatDialog} from '@angular/material/dialog';
import {UserEditComponent} from '../../component/user-edit/user-edit.component';
import {DeleteUserComponent} from '../../component/delete-user/delete-user.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  userModels: UserModel[] = [];
  routeConstant = RouteConstant;

  dataSource: MatTableDataSource<UserModel>;
  displayedColumns = ['number', 'email', 'name', 'role', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private userService: UserService, private router: Router, private dialogUtil: LoadingDialogUtil, private store: Store) {
  }

  ngOnInit(): void {
    const dialogRef = this.dialogUtil.openLoadingDialog();
    this.userService.getAllUsers().subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        console.log(resp);
        this.userModels = resp.data;
        this.initTable();
        dialogRef.close();
      }

    });
  }

  initTable(): void {
    this.dataSource = new MatTableDataSource(this.userModels);
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
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   switch (property) {
    //     case this.displayedColumns[0]:
    //       return this.dataSource.data.indexOf(item);
    //     case this.displayedColumns[1]:
    //       return item.studentName;
    //     case this.displayedColumns[2]:
    //       return item.title;
    //     case this.displayedColumns[3]:
    //       return item.supervisorModel.name;
    //     default:
    //       return item[property];
    //   }
    // };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPaginatorOptions(): number[] {
    const max = 100;
    const options = [10, 25, 50, max];
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > max) {
      options.push(this.dataSource.data.length);
    }
    return options;
  }

  edit(userModel: UserModel): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      data: userModel,
    });
    dialogRef.afterClosed().subscribe(reload => {
      if (reload) {
        this.ngOnInit();
      }
    });
  }

  delete(userModel: UserModel): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: userModel,
    });
    dialogRef.afterClosed().subscribe(reload => {
      if (reload) {
        this.ngOnInit();
      }
    });
  }

  getSystemRoleName(role: SystemRole): string {
    switch (role) {
      case SystemRole.ADMIN:
        return 'Admin';
      case SystemRole.COORDINATOR:
        return 'Coordinator';
      case SystemRole.LECTURER:
        return 'Lecturer';
      case SystemRole.OFFICE:
        return 'Office Staff';
    }

  }

}
