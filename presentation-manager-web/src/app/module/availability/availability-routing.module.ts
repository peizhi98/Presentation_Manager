import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AvailabilityComponent} from './page/availability/availability.component';

const routes: Routes = [
  {
    path: '', component: null,
    children: [
      {path: '', component: AvailabilityComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailabilityRoutingModule {
}
