import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateTimePickerModule} from '@syncfusion/ej2-angular-calendars';
import {AvailabilityRoutingModule} from './availability-routing.module';
import {AvailabilityComponent} from './page/availability/availability.component';
import {
  DayService,
  DragAndDropService,
  MonthAgendaService,
  MonthService,
  ResizeService,
  ScheduleAllModule,
  WeekService,
  WorkWeekService,
  YearService
} from '@syncfusion/ej2-angular-schedule';
import {SharedModule} from '../shared.module';
import { ViewUserAvailabilityComponent } from './page/view-user-availability/view-user-availability.component';
import { ManageAvailabilityComponent } from './page/manage-availability/manage-availability.component';

console.log('availability');

@NgModule({
  declarations: [
    AvailabilityComponent,
    ViewUserAvailabilityComponent,
    ManageAvailabilityComponent
  ],
  imports: [
    CommonModule,
    AvailabilityRoutingModule,
    ScheduleAllModule,
    SharedModule,
    DateTimePickerModule,
  ],
  exports: [
    AvailabilityComponent
  ]
})
export class AvailabilityModule {
}
