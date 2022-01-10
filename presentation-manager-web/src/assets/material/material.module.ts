import {NgModule} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatNativeDateModule, MatOptionModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


const Material = [
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatDialogModule,
  MatOptionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatSidenavModule,
  MatRippleModule,
  MatListModule,
  MatDividerModule,
  MatMenuModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatPaginatorModule,
  MatSortModule,
  MatAutocompleteModule,
  DragDropModule,
  MatStepperModule,
  MatExpansionModule,
  MatRadioModule,
  MatTooltipModule,
  MatButtonToggleModule
];

@NgModule({
  declarations: [],
  imports: [
    Material
  ],
  exports: [
    Material
  ]
})
export class MaterialModule {
}
