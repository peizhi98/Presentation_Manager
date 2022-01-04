import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PresentationScheduleRoutingModule} from './presentation-schedule-routing.module';
import {SharedModule} from '../shared.module';
import {SchedulesViewComponent} from './page/schedules-view/schedules-view.component';
import {CreateScheduleComponent} from './page/create-schedule/create-schedule.component';
import {ScheduleComponent} from './page/schedule/schedule.component';
import {AddPresentationComponent} from './component/add-presentation/add-presentation.component';
import {ReadExcelDirective} from '../../../assets/directive/read-excel.directive';
import {EvaluationCriteriaComponent} from './component/evaluation-criteria/evaluation-criteria.component';
import {PresentationComponent} from './component/presentation/presentation.component';
import {PresentationsViewComponent} from './component/presentations-view/presentations-view.component';
import {
  ScheduleAllModule
} from '@syncfusion/ej2-angular-schedule';
import { TimetableComponent } from './component/timetable/timetable.component';
import { EvaluationFormFypComponent } from './component/evaluation-form-fyp/evaluation-form-fyp.component';
import { EvaluationFormMasterComponent } from './component/evaluation-form-master/evaluation-form-master.component';
import { EvaluatePresentationComponent } from './component/evaluate-presentation/evaluate-presentation.component';
import { EvaluationReportComponent } from './component/evaluation-report/evaluation-report.component';

@NgModule({
  declarations: [
    SchedulesViewComponent,
    CreateScheduleComponent,
    ScheduleComponent,
    AddPresentationComponent,
    ReadExcelDirective,
    EvaluationCriteriaComponent,
    PresentationComponent,
    PresentationsViewComponent,
    TimetableComponent,
    EvaluationFormFypComponent,
    EvaluationFormMasterComponent,
    EvaluatePresentationComponent,
    EvaluationReportComponent,
  ],
  exports: [
    SchedulesViewComponent,
    CreateScheduleComponent,
    ScheduleComponent,
    AddPresentationComponent,
    ReadExcelDirective,
    EvaluationCriteriaComponent,
    PresentationComponent,
    PresentationsViewComponent,
  ],
  imports: [
    CommonModule,
    PresentationScheduleRoutingModule,
    SharedModule,
    ScheduleAllModule,
  ],
})
export class PresentationScheduleModule {
}
