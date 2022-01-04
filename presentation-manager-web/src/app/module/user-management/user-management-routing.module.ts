import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserManagementComponent} from './page/user-management/user-management.component';
import {AddUsersComponent} from './page/add-users/add-users.component';
import {RouteConstant} from '../../../assets/constant/route.contant';

const routes: Routes = [
  {
    path: '', component: null,
    children: [
      {path: '', component: UserManagementComponent},
      {path: RouteConstant.ADD_USER, component: AddUsersComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}
