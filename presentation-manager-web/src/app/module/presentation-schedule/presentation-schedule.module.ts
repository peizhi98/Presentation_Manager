import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PresentationScheduleRoutingModule} from './presentation-schedule-routing.module';
import {SharedModule} from '../shared.module';
import {HomeComponent} from './page/home/home.component';
import {CreateScheduleComponent} from './page/create-schedule/create-schedule.component';
import {ScheduleComponent} from './page/schedule/schedule.component';
import {AddPresentationComponent} from './component/add-presentation/add-presentation.component';
import {ReadexcelDirective} from '../../../assets/directive/read-excel.directive';
import {EvaluationCriteriaComponent} from '../../component/evaluation-criteria/evaluation-criteria.component';
import {GeneralComponent} from './component/general/general.component';
import {PresentationComponent} from './component/presentation/presentation.component';
import {PresentationListComponent} from './component/presentation-list/presentation-list.component';
import {
  DayService, DragAndDropService,
  MonthAgendaService,
  MonthService, ResizeService,
  ScheduleAllModule,
  WeekService,
  WorkWeekService,
  YearService
} from '@syncfusion/ej2-angular-schedule';

console.log('schedule');
@NgModule({
  declarations: [
    HomeComponent,
    CreateScheduleComponent,
    ScheduleComponent,
    AddPresentationComponent,
    ReadexcelDirective,
    EvaluationCriteriaComponent,
    GeneralComponent,
    PresentationComponent,
    PresentationListComponent
  ],
  exports: [
    HomeComponent,
    CreateScheduleComponent,
    ScheduleComponent,
    AddPresentationComponent,
    ReadexcelDirective,
    EvaluationCriteriaComponent,
    GeneralComponent,
    PresentationComponent,
    PresentationListComponent
  ],
  imports: [
    CommonModule,
    PresentationScheduleRoutingModule,
    SharedModule,
    ScheduleAllModule,
  ],
  providers:[
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
export class PresentationScheduleModule {
}
