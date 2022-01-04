import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './page/user-management/user-management.component';
import {SharedModule} from '../shared.module';
import { UserEditComponent } from './component/user-edit/user-edit.component';
import { DeleteUserComponent } from './component/delete-user/delete-user.component';
import { AddUsersComponent } from './page/add-users/add-users.component';


@NgModule({
  declarations: [UserManagementComponent, UserEditComponent, DeleteUserComponent, AddUsersComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
  ]
})
export class UserManagementModule { }
