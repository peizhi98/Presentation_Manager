import {Component, OnDestroy, OnInit} from '@angular/core';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PanelModel} from '../../../../model/role/panel.model';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {XlsxUtil} from '../../../../util/xlsx.util';
import {SupervisorModel} from '../../../../model/role/supervisor.model';
import {PatchLecturerFromBackend} from '../../../../store/user/user.action';
import {UserState} from '../../../../store/user/user.store';
import {LecturerModel} from '../../../../model/role/lecturer.model';
import {ScheduleType} from '../../../../model/schedule/schedule.model';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-add-presentation',
  templateUrl: './add-presentation.component.html',
  styleUrls: ['./add-presentation.component.css']
})
export class AddPresentationComponent implements OnInit, OnDestroy {
  presentationModels: PresentationModel[] = [];
  scheduleId: number;
  scheduleType: ScheduleType;
  readingExcel = false;
  current = '';
  lecturers: LecturerModel[] = [];
  filteredLecturers: LecturerModel[] = [];
  @Select(UserState.getLecturer)
  lecturers$: Observable<LecturerModel[]>;

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  @Select(ScheduleState.getScheduleType)
  scheduleType$: Observable<ScheduleType>;

  constructor(private presentationService: PresentationService,
              private store: Store,
              private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              private xlsxUtil: XlsxUtil) {
  }

  ngOnDestroy(): void {
    this.presentationModels = [];
  }

  ngOnInit(): void {
    this.scheduleId$.subscribe(id => {
      this.scheduleId = id;
    });
    this.scheduleType$.subscribe(type => {
      this.scheduleType = type;
    });
    this.store.dispatch(new PatchLecturerFromBackend());
    this.lecturers$.subscribe(lec => {
      this.lecturers = lec;
    });
    this.addForm();
  }

  addForm(): void {
    const presentationModel = new PresentationModel();
    presentationModel.scheduleId = this.scheduleId;
    presentationModel.panelModels = [];
    presentationModel.panelModels.push(new PanelModel());
    presentationModel.panelModels.push(new PanelModel());
    this.presentationModels.push(presentationModel);
  }

  removeForm(i: number): void {
    if (this.presentationModels.length > 1) {
      this.presentationModels.forEach((element, index) => {
        if (index === i) {
          this.presentationModels.splice(index, 1);
        }
      });
    }
  }

  addPanel(presentationModel: PresentationModel): void {
    presentationModel.panelModels.push(new PanelModel());
  }

  removePanel(panelModels: PanelModel[], i: number): void {
    if (panelModels.length > 1) {
      panelModels.forEach((element, index) => {
        if (index === i) {
          panelModels.splice(index, 1);
        }
      });
    }
  }

  save(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog();
    console.log(this.presentationModels);
    this.presentationService.addPresentationList(this.presentationModels).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        this.openSnackBar('Successfully Added Presentations.');
        this.presentationModels = [];
        this.addForm();
      } else {
        this.openSnackBar('Failed to Add Presentations.');
      }
      loadingRef.close();
    });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }


  readXlsx(event): void {
    // const excelLoading = this.loadingUtil.openLoadingDialog('Reading File...');
    this.readingExcel = true;
    const file: File = event.target.files[0];
    this.xlsxUtil.readFile(file).subscribe(data => {
      const presentationModelList: PresentationModel[] = [];
      data.forEach(d => {
        const presentation = new PresentationModel();
        presentation.scheduleId = this.scheduleId;
        const sv = new SupervisorModel();
        sv.email = d['Supervisor'];
        presentation.supervisorModel = sv;
        presentation.title = d['Presentation Title'];
        presentation.studentEmail = d['Student Email'];
        presentation.studentName = d['Student Name'];
        presentation.studentMatrixNo = d['Student Matric No.'];
        if (this.scheduleType === ScheduleType.MASTER_DISSERTATION) {
          const chairperson = new PanelModel();
          chairperson.email = d['Chairperson'];
          presentation.chairperson = chairperson;
        }
        const panel1: PanelModel = new PanelModel();
        panel1.email = d['Panel 1'];
        const panel2: PanelModel = new PanelModel();
        panel2.email = d['Panel 2'];
        const panel3: PanelModel = new PanelModel();
        panel3.email = d['Panel 3'];

        presentation.panelModels = [];
        if (panel1.email) {
          presentation.panelModels.push(panel1);
        }
        if (panel2.email) {
          presentation.panelModels.push(panel2);
        }
        if (panel3.email) {
          presentation.panelModels.push(panel3);
        }
        if (presentation.panelModels.length === 0) {
          presentation.panelModels.push(new PanelModel());
          presentation.panelModels.push(new PanelModel());
        }
        if (presentation.panelModels.length === 1) {
          presentation.panelModels.push(new PanelModel());
        }
        presentationModelList.push(presentation);
      });

      this.presentationModels = presentationModelList;
      console.log('done');
      this.readingExcel = false;
      // excelLoading.close();

      // this.webWorkerService.getPresentationDetailsFromData(data, this.scheduleId).subscribe(presentations => {
      //   this.presentationModels = presentations;
      // });
    });
  }

  applyFilter(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredLecturers = inputValue ? this.filterLecturers(inputValue) : this.lecturers.slice();
  }

  private filterLecturers(value: string): LecturerModel[] {
    const filterValue = value.trim().toLowerCase();
    const filteredLec = [];
    this.lecturers.forEach(lec => {
      const searchSpace = (lec.name) ? (lec.name + lec.email) : lec.email;
      if (searchSpace.trim().toLowerCase().includes(filterValue)) {
        filteredLec.push(lec);
      }
    });
    return filteredLec;
    // return this.lecturers.filter(lecturer => {
    //   if (!lecturer.name) {
    //     lecturer.name = '';
    //   }
    //   console.log(lecturer.name.toLowerCase().includes(filterValue));
    //   lecturer.name.toLowerCase().includes(filterValue);
    // });
  }

  isMaster(): boolean {
    return this.scheduleType === ScheduleType.MASTER_DISSERTATION;
  }

  get SystemRole() {
    return SystemRole;
  }
}
