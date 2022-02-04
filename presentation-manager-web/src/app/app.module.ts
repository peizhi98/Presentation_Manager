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
import {LoadingDialogComponent} from './component/loading-dialog/loading-dialog.component';
import {ErrorHandlingInterceptor} from './util/error-handling.interceptor';
import {UserState} from './store/user/user.store';
import {NotFoundComponent} from './component/not-found/not-found.component';
import {EvaluationState} from './store/evaluation/evaluation.store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PresentationState} from './store/presentation/presentation.store';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UnauthorizedComponent} from './component/unauthorized/unauthorized.component';
import {UserRoleState} from './store/user-role/user-role.store';
import {DecimalPipe} from '@angular/common';
import {ChartsModule} from 'ng2-charts';
import {HttpCancelInterceptor} from './util/http-cancel.interceptor';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { MarkingSchemeDialogComponent } from './component/marking-scheme-dialog/marking-scheme-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingDialogComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    ConfirmationDialogComponent,
    MarkingSchemeDialogComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgxsModule.forRoot([ScheduleState, AuthState, AppState, UserState, EvaluationState, PresentationState, UserRoleState]),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: HttpCancelInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

