import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './util/auth.guard';
import {NotFoundComponent} from './component/not-found/not-found.component';
import {RouteConstant} from '../assets/constant/route.contant';
import {UnauthorizedComponent} from './component/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: RouteConstant.DASHBOARD,
    loadChildren: () => import('./module/dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: RouteConstant.AUTH,
    loadChildren: () => import('./module/auth/auth.module').then(mod => mod.AuthModule)
  },
  {
    path: RouteConstant.SCHEDULE_VIEW,
    loadChildren: () => import('./module/presentation-schedule/presentation-schedule.module').then(mod => mod.PresentationScheduleModule),
    canActivate: [AuthGuard],
  },
  {
    path: RouteConstant.AVAILABILITY,
    loadChildren: () => import('./module/availability/availability.module').then(mod => mod.AvailabilityModule),
    canActivate: [AuthGuard]
  },
  {
    path: RouteConstant.USER_MANAGEMENT,
    loadChildren: () => import('./module/user-management/user-management.module').then(mod => mod.UserManagementModule),
    canActivate: [AuthGuard]
  },
  {path: RouteConstant.UNAUTHORIZED, component: UnauthorizedComponent},
  {path: '**', component: NotFoundComponent}
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
