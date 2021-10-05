import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './util/auth.guard';

const routes: Routes = [
  // {path: 'home', component: HomeComponent},
  {
    path: 'auth',
    loadChildren: () => import('./module/auth/auth.module').then(mod => mod.AuthModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./module/presentation-schedule/presentation-schedule.module').then(mod => mod.PresentationScheduleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'availability',
    loadChildren: () => import('./module/availability/availability.module').then(mod => mod.AvailabilityModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
