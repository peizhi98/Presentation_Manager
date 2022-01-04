import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../../assets/material/material.module';
import {NgxPermissionsModule} from 'ngx-permissions';

const SHARED_MODULE = [
  RouterModule,
  FormsModule,
  MaterialModule,
  ReactiveFormsModule,
  NgxPermissionsModule
];


@NgModule({
  declarations: [],
  imports: [
    ...SHARED_MODULE,
    NgxPermissionsModule.forChild()
  ],
  exports: [
    ...SHARED_MODULE,
  ]
})
export class SharedModule {
}
