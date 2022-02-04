import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateScheduleComponent} from './page/create-schedule/create-schedule.component';
import {ScheduleComponent} from './page/schedule/schedule.component';
import {SchedulesViewComponent} from './page/schedules-view/schedules-view.component';
import {PresentationsViewComponent} from './component/presentations-view/presentations-view.component';
import {RouteConstant} from '../../../assets/constant/route.contant';
import {AddPresentationComponent} from './component/add-presentation/add-presentation.component';
import {TimetableComponent} from './component/timetable/timetable.component';
import {EvaluationCriteriaComponent} from './component/evaluation-criteria/evaluation-criteria.component';
import {PresentationComponent} from './component/presentation/presentation.component';
import {EvaluatePresentationComponent} from './component/evaluate-presentation/evaluate-presentation.component';
import {EvaluationReportComponent} from './component/evaluation-report/evaluation-report.component';
import {AutoSchedulingSettingComponent} from './component/auto-scheduling-setting/auto-scheduling-setting.component';
import {GoogleIntegrationComponent} from './component/google-integration/google-integration.component';
import {PresentationEvalautionReportComponent} from './component/presentation-evalaution-report/presentation-evalaution-report.component';

const routes: Routes = [
  {
    path: '', component: null,
    children: [
      {path: '', component: SchedulesViewComponent},
      {path: RouteConstant.CREATE, component: CreateScheduleComponent},
      {
        path: RouteConstant.SCHEDULE, component: ScheduleComponent,
        children: [
          {
            path: RouteConstant.PRESENTATION_VIEW, component: null,
            children: [
              {path: '', component: PresentationsViewComponent},
              {path: RouteConstant.ADD_PRESENTATION, component: AddPresentationComponent},
              {
                path: RouteConstant.PRESENTATION, component: PresentationComponent,
                children: [
                  {path: '', component: null},
                  {
                    path: RouteConstant.EVALUATE, component: null,
                    children: [
                      {path: RouteConstant.FORM, component: EvaluatePresentationComponent}
                    ]
                  },
                  {
                    path: RouteConstant.REPORT, component: null,
                    children: [
                      {path: RouteConstant.FORM, component: PresentationEvalautionReportComponent}
                    ]
                  },
                ]
              },
            ]
          },

          {path: RouteConstant.TIMETABLE, component: null,
            children: [
              {path: '', component: TimetableComponent},
              {path: RouteConstant.AUTO_SCHEDULE, component: AutoSchedulingSettingComponent}
            ]},
          {path: RouteConstant.CRITERIA, component: EvaluationCriteriaComponent},
          {path: RouteConstant.EVALUATION_VIEW, component: EvaluationReportComponent},
          {path: RouteConstant.GOOGLE_CALENDAR, component: GoogleIntegrationComponent},
        ]
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationScheduleRoutingModule {
}
