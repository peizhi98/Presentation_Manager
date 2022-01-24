import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AvailabilityComponent} from './page/availability/availability.component';
import {RouteConstant} from '../../../assets/constant/route.contant';
import {ManageAvailabilityComponent} from './page/manage-availability/manage-availability.component';
import {ViewUserAvailabilityComponent} from './page/view-user-availability/view-user-availability.component';

const routes: Routes = [
  {
    path: '', component: AvailabilityComponent,
    children: [
      {path: '', component: ManageAvailabilityComponent},
      {path: RouteConstant.USER_AVAILABILITY, component: ViewUserAvailabilityComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailabilityRoutingModule {
}
