import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxsModule} from '@ngxs/store';
import {ScheduleState} from './store/schedule/schedule.store';
import {AuthInterceptor} from './util/auth.interceptor';
import {AuthState} from './store/auth/auth.store';
import {AppState} from './store/app/app.store';
import {SharedModule} from './module/shared.module';
import {
  AgendaService,
  DayService, ExcelExportService,
  MonthAgendaService,
  MonthService,
  TimelineViewsService,
  WeekService,
  WorkWeekService
} from '@syncfusion/ej2-angular-schedule';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([ScheduleState, AuthState, AppState]),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

