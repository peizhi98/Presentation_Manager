import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateScheduleComponent} from './page/create-schedule/create-schedule.component';
import {ScheduleComponent} from './page/schedule/schedule.component';
import {HomeComponent} from './page/home/home.component';

const routes: Routes = [
  {
    path: '', component: null,
    children: [
      {path: '', component: HomeComponent},
      {path: 'create', component: CreateScheduleComponent},
      {path: 'manage', component: ScheduleComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationScheduleRoutingModule {
}
