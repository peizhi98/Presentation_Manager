import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../../assets/material/material.module';

const SHARED_MODULE = [
  RouterModule,
  FormsModule,
  MaterialModule,
  ReactiveFormsModule,
];


@NgModule({
  declarations: [
    // [...IMPORTED_AND_EXPORTED_COMPONENTS],
  ],
  imports: [
    ...SHARED_MODULE,
  ],
  exports: [
    ...SHARED_MODULE,
    // ...IMPORTED_AND_EXPORTED_COMPONENTS
  ]
})
export class SharedModule {
}
