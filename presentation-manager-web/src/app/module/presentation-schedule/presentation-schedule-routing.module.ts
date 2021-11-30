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
              {path: RouteConstant.PRESENTATION, component: PresentationComponent},
              {path: RouteConstant.ADD_PRESENTATION, component: AddPresentationComponent},
            ]
          },

          {path: RouteConstant.TIMETABLE, component: TimetableComponent},
          {path: RouteConstant.CRITERIA, component: EvaluationCriteriaComponent},
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
