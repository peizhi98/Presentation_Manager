import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateScheduleComponent} from './page/create-schedule/create-schedule.component';
import {ScheduleComponent} from './page/schedule/schedule.component';
import {HomeComponent} from './page/home/home.component';
import {PresentationListComponent} from './component/presentation-list/presentation-list.component';
import {RouteConstant} from '../../../assets/constant/route.contant';
import {AddPresentationComponent} from './component/add-presentation/add-presentation.component';

const routes: Routes = [
  {
    path: '', component: null,
    children: [
      {path: '', component: HomeComponent},
      {
        path: RouteConstant.SCHEDULE, component: ScheduleComponent, children: [
          {path: '', redirectTo: RouteConstant.PRESENTATION},
          {
            path: RouteConstant.PRESENTATION, component: null,
            children: [
              {path: '', component: PresentationListComponent},
              {path: RouteConstant.ADD_PRESENTATION, component: AddPresentationComponent},
            ]
          },

          {path: RouteConstant.TIMETABLE, component: PresentationListComponent},
        ]
      },
      {path: RouteConstant.CREATE, component: CreateScheduleComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationScheduleRoutingModule {
}
