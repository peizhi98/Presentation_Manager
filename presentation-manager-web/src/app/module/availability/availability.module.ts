import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import {AvailabilityRoutingModule} from './availability-routing.module';
import {AvailabilityComponent} from './page/availability/availability.component';
import {
  YearService,
  DayService,
  MonthAgendaService,
  MonthService,
  ScheduleModule,
  WeekService,
  WorkWeekService, DragAndDropService, ResizeService, ScheduleAllModule
} from '@syncfusion/ej2-angular-schedule';
import {SharedModule} from '../shared.module';

console.log('availability');

@NgModule({
  declarations: [
    AvailabilityComponent
  ],
  imports: [
    CommonModule,
    AvailabilityRoutingModule,
    ScheduleAllModule,
    SharedModule,
    DateTimePickerModule
  ],
  exports: [
    AvailabilityComponent
  ],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    YearService,
    MonthAgendaService,
    DragAndDropService,
    ResizeService
  ]
})
export class AvailabilityModule {
}
