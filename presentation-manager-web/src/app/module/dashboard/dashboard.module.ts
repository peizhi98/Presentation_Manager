import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './page/dashboard/dashboard.component';
import {SharedModule} from '../shared.module';
import {PresentationsTableComponent} from './component/presentations-table/presentations-table.component';


@NgModule({
  declarations: [DashboardComponent, PresentationsTableComponent],
  exports: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule {
}
