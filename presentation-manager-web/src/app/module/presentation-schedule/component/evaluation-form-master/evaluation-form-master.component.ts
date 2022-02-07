import {Component, OnDestroy, OnInit} from '@angular/core';
import {CriterionModel} from '../../../../model/evaluation/criterion.model';
import {EvaluationFormMode, EvaluationFormModel, EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable, Subscription} from 'rxjs';
import {EvaluationFormService} from '../../../../service/evluation-form.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constant} from '../../../../../assets/constant/app.constant';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {EvaluationState} from '../../../../store/evaluation/evaluation.store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EvaluationModel} from '../../../../model/evaluation/evaluation.model';
import {PresentationState} from '../../../../store/presentation/presentation.store';
import {CriterionEvaluationModel} from '../../../../model/evaluation/criterion-evaluation.model';
import {EvaluationService} from '../../../../service/evaluation.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../../component/confirmation-dialog/confirmation-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ChangeEvaluationFormMode} from '../../../../store/evaluation/evaluation.action';
import {MarkingSchemeDialogComponent} from '../../../../component/marking-scheme-dialog/marking-scheme-dialog.component';

@Component({
  selector: 'app-evaluation-form-master',
  templateUrl: './evaluation-form-master.component.html',
  styleUrls: ['./evaluation-form-master.component.css']
})
export class EvaluationFormMasterComponent implements OnInit, OnDestroy {
  scheduleId: number;
  evaluationType: EvaluationType;
  evaluationFormModel: EvaluationFormModel;
  evaluationModel: EvaluationModel;
  criteriaModels: CriterionModel[] = [];
  scaleOptions = [1, 2, 3, 4, 5, 6];
  confirmationScaleOptions = [0, 1, 2];
  evaluationFormMode = EvaluationFormMode.VIEW;
  currentForm: FormGroup;
  evaluationForm: FormGroup;
  evaluationFormEditingForm: FormGroup;
  presentationId: number;
  readonly ID = 'id';
  readonly NAME = 'name';
  readonly RATING = 'rating';
  readonly COMMENT = 'comment';
  readonly WEIGHTAGE = 'weightage';
  readonly CRITERION_ID = 'criterionId';
  readonly LINK = 'link';
  readonly CRITERION_EVALUATION_ID = 'criterionEvaluationId';
  readonly CRITERIA_EVALUATION = 'criteriaEvaluation';
  readonly OVERALL_COMMENT = 'overallComment';
  readonly OVERALL_RESULT = 'overallResult';
  subs: Subscription[] = [];

  @Select(ScheduleState.getScheduleId)
  scheduleId$: Observable<number>;

  @Select(EvaluationState.getEvaluationType)
  evaluationType$: Observable<EvaluationType>;

  @Select(EvaluationState.getEvaluationFormMode)
  evaluationFormMode$: Observable<EvaluationFormMode>;

  @Select(PresentationState.getPresentationId)
  presentationId$: Observable<number>;


  constructor(private evaluationFormService: EvaluationFormService, private matSnackBar: MatSnackBar,
              private loadingUtil: LoadingDialogUtil, private evaluationService: EvaluationService,
              private formBuilder: FormBuilder, private store: Store, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
    this.store.dispatch(new ChangeEvaluationFormMode(null));
  }

  ngOnInit(): void {
    console.log('master form');
    this.subs.push(this.scheduleId$.subscribe(id => {
      if (id) {
        this.scheduleId = id;
        console.log(this.scheduleId);
        this.initFormGroup();
      }
    }));
    this.subs.push(this.evaluationFormMode$.subscribe(mode => {
      if (mode) {
        this.evaluationFormMode = mode;
        console.log(this.evaluationFormMode);
        this.initFormGroup();
      }
    }));
    this.subs.push(this.evaluationType$.subscribe(type => {
        if (type) {
          this.evaluationType = type;
          console.log(this.evaluationType);
          this.initFormGroup();
        }
      }
    ));
    this.subs.push(this.presentationId$.subscribe(pId => {
      if (pId) {
        this.presentationId = pId;
        console.log(this.presentationId);
        this.initFormGroup();
      }
    }));


  }

  initFormGroup(): void {
    if ((this.evaluationType === EvaluationType.CONFIRMATION
      || this.evaluationType === EvaluationType.PANEL)
      && this.scheduleId
      && this.evaluationType
      && this.evaluationFormMode) {
      this.currentForm = null;
      console.log(' initiating...' + this.scheduleId + '-' + this.evaluationType + '-' + this.evaluationFormMode + '-' + this.presentationId + '-');
      switch (this.evaluationFormMode) {
        case EvaluationFormMode.EVALUATE:
          this.initEvaluationForm();
          break;
        case EvaluationFormMode.EDIT:
          this.initEvaluationFormEditingForm();
          break;
        case EvaluationFormMode.VIEW:
          this.initEvaluationFormEditingForm();
          break;
      }
    }
  }

  initEvaluationForm(): void {
    if (this.presentationId) {
      const loadingRef = this.loadingUtil.openLoadingDialog();
      this.evaluationService.getAuthUserEvaluation(this.evaluationType, this.presentationId)
        .subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.evaluationModel = resp.data;
            console.log(this.evaluationModel);
            if (!this.evaluationModel.id) {
              this.evaluationModel.presentationId = this.presentationId;
            }
            if (!this.evaluationModel.criterionEvaluationModelList) {
              this.evaluationModel.criterionEvaluationModelList = [];
            }
            // this.criteriaModels = this.evaluationFormModel.criterionModels;
            // build form
            this.evaluationForm = this.formBuilder.group({
              criteriaEvaluation: this.formBuilder.array([]),
              overallResult: this.getOverallRatingControl(),
              overallComment: this.formBuilder.control(this.evaluationModel.comment),
              link: this.formBuilder.control(this.evaluationModel.rubricUrl)
            });
            this.evaluationModel.criterionEvaluationModelList.forEach(c => {
              this.addCriterionEvaluationControl(c);
            });
            this.currentForm = this.evaluationForm;
          } else {
            if (this.evaluationType === EvaluationType.CONFIRMATION) {
              this.openSnackBar('Unable to generate confirmation form. ' + resp.message);
            } else {
              this.openSnackBar('Failed to retrieve form.' + resp.message);
            }
          }
          loadingRef.close();
        });
    }


  }

  getOverallRatingControl() {
    if (this.evaluationType === EvaluationType.CONFIRMATION) {
      const c: FormControl = this.formBuilder.control(this.evaluationModel.rating, Validators.required);
      // c.disable();
      return c;
    } else {
      return this.formBuilder.control('');
    }
  }

  addCriterionEvaluationControl(criterionEvaluation: CriterionEvaluationModel): void {
    (this.evaluationForm.get(this.CRITERIA_EVALUATION) as FormArray).push(this.formBuilder.group({
      criterionEvaluationId: this.formBuilder.control(criterionEvaluation.id),
      name: this.formBuilder.control(criterionEvaluation.criterionModel.name),
      weightage: this.formBuilder.control(criterionEvaluation.criterionModel.weightage),
      rating: this.getRatingControl(criterionEvaluation),
      comment: this.formBuilder.control(criterionEvaluation.comment),
      criterionId: this.formBuilder.control(criterionEvaluation.criterionModel.id)
    }));
  }

  getRatingControl(criterionEvaluation: CriterionEvaluationModel): FormControl {
    if (this.evaluationType === EvaluationType.PANEL) {
      return this.formBuilder.control(criterionEvaluation.rating, Validators.required);
    }
    return this.formBuilder.control(criterionEvaluation.rating, [Validators.required, Validators.max(criterionEvaluation.criterionModel.weightage)]);
  }

  initEvaluationFormEditingForm(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog();
    this.evaluationFormService.getEvaluationForm(this.scheduleId, this.evaluationType)
      .subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.evaluationFormModel = resp.data;
          if (!this.evaluationFormModel.id) {
            this.evaluationFormModel.evaluationType = this.evaluationType;
            this.evaluationFormModel.scheduleId = this.scheduleId;
          }
          if (!this.evaluationFormModel.criterionModels) {
            this.evaluationFormModel.criterionModels = [];
          }
          this.criteriaModels = this.evaluationFormModel.criterionModels;
          // build form
          this.evaluationFormEditingForm = this.formBuilder.group({
            overallResult: this.formBuilder.control({value: '', disabled: true}),
            overallComment: this.formBuilder.control({value: '', disabled: true}),
            link: this.formBuilder.control(this.evaluationFormModel.rubricUrl),
            criteriaEvaluation: this.formBuilder.array([])
          });
          this.evaluationFormModel.criterionModels.forEach(c => {
            this.addCriterionEditingControl(c);
          });
          this.currentForm = this.evaluationFormEditingForm;
        }
        console.log(this.currentForm);
        // this.calculateTotalWeightage();
        loadingRef.close();
      });

  }

  addCriterionEditingControl(criterionModel: CriterionModel): void {
    (this.evaluationFormEditingForm.get(this.CRITERIA_EVALUATION) as FormArray).push(this.formBuilder.group({
      name: this.formBuilder.control(criterionModel.name, Validators.required),
      weightage: this.formBuilder.control(criterionModel.weightage, [Validators.required, Validators.pattern('^[0-9]*$')]),
      rating: this.formBuilder.control({value: '', disabled: true}),
      comment: this.formBuilder.control({value: '', disabled: true}),
      criterionId: this.formBuilder.control(criterionModel.id)
    }));
  }

  get criteriaEvaluation(): FormArray {
    return this.currentForm.get(this.CRITERIA_EVALUATION) as FormArray;
  }


  calculateTotalWeightage(): number {
    let total = 0;
    if (this.criteriaEvaluation.controls) {
      this.criteriaEvaluation.controls.forEach(c => {
        if (c.get(this.WEIGHTAGE)) {
          total += c.get(this.WEIGHTAGE).value;
        }
      });
    }
    return total;
  }

  calculateTotalMark(): number {
    let total = 0;
    if (this.criteriaEvaluation.controls) {
      this.criteriaEvaluation.controls.forEach(c => {
        if (c.get(this.RATING)) {
          if (this.evaluationType === EvaluationType.PANEL) {
            total += (c.get(this.RATING).value / 6) * c.get(this.WEIGHTAGE).value;
          } else {
            total += c.get(this.RATING).value;
          }
        }
      });
    }
    return total;
  }

  addCriterion(): void {
    console.log('add criterion');
    const newCriterion = new CriterionModel();
    this.addCriterionEditingControl(newCriterion);
  }

  removeCriterion(i: number): void {
    console.log(this.criteriaModels);
    if (this.criteriaEvaluation.controls.length > 1) {
      this.criteriaEvaluation.controls.splice(i, 1);
    }
    // this.calculateTotalWeightage();
    // this.table.renderRows();
  }

  isFypPresentation(): boolean {
    return this.evaluationType === EvaluationType.PRESENTATION;
  }

  onSubmit(): void {
    this.currentForm.markAllAsTouched();
    if (this.currentForm.valid) {
      switch (this.evaluationFormMode) {
        case EvaluationFormMode.EVALUATE:
          this.submitEvaluation();
          break;
        case EvaluationFormMode.EDIT:
          this.saveCriteria();
          break;
        case EvaluationFormMode.VIEW:
          break;
      }
    } else {
      this.openSnackBar('Invalid form input.');
    }

  }

  submitEvaluation(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Submitting...');
    if (this.evaluationFormMode === EvaluationFormMode.EVALUATE) {
      const evaluationModel: EvaluationModel = new EvaluationModel();
      evaluationModel.id = this.evaluationModel.id;
      evaluationModel.presentationId = this.evaluationModel.presentationId;
      evaluationModel.evaluationFormId = this.evaluationModel.evaluationFormId;
      evaluationModel.comment = this.currentForm.get(this.OVERALL_COMMENT).value;
      evaluationModel.rating = this.currentForm.get(this.OVERALL_RESULT).value;
      const criteriaEvaluation: CriterionEvaluationModel[] = [];
      console.log(this.criteriaEvaluation);
      this.criteriaEvaluation.controls.forEach(c => {
        const criterionEvaluation: CriterionEvaluationModel = new CriterionEvaluationModel();
        criterionEvaluation.criterionModel = new CriterionModel();
        criterionEvaluation.id = c.get(this.CRITERION_EVALUATION_ID).value;
        criterionEvaluation.criterionModel.id = c.get(this.CRITERION_ID).value;
        criterionEvaluation.comment = c.get(this.COMMENT).value;
        criterionEvaluation.rating = c.get(this.RATING).value;
        criteriaEvaluation.push(criterionEvaluation);
      });
      evaluationModel.criterionEvaluationModelList = criteriaEvaluation;
      this.evaluationService.evaluate(evaluationModel).subscribe(resp => {
        loadingRef.close();
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.openSnackBar('Successfully submit evaluation form');
          this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
        } else {
          this.openSnackBar('Failed to submit evaluation form.');
        }
      });
    }
  }

  saveCriteria(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Saving...');
    const editedEvaluationForm: EvaluationFormModel = new EvaluationFormModel();
    editedEvaluationForm.id = this.evaluationFormModel.id;
    editedEvaluationForm.evaluationType = this.evaluationType;
    editedEvaluationForm.scheduleId = this.scheduleId;
    editedEvaluationForm.rubricUrl = this.currentForm.get(this.LINK).value;
    const criterionModels: CriterionModel[] = [];
    editedEvaluationForm.criterionModels = criterionModels;
    this.criteriaEvaluation.controls.forEach(c => {
      const criterion: CriterionModel = new CriterionModel();
      criterion.id = c.get(this.CRITERION_ID).value;
      criterion.name = c.get(this.NAME).value;
      criterion.weightage = c.get(this.WEIGHTAGE).value;
      criterionModels.push(criterion);
    });
    this.evaluationFormService
      .addOrEditEvaluationForm(editedEvaluationForm)
      .subscribe(resp => {
        loadingRef.close();
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.openSnackBar('Successfully save evaluation criteria');
        } else {
          this.openSnackBar('Failed to save changes. '+resp.message);
        }
      });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.criteriaEvaluation.controls, event.previousIndex, event.currentIndex);
  }

  isEditMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.EDIT;
  }

  isViewMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.VIEW;
  }

  isEvaluateMode(): boolean {
    return this.evaluationFormMode === EvaluationFormMode.EVALUATE;
  }

  isPanelForm(): boolean {
    return this.evaluationType === EvaluationType.PANEL;
  }

  isConfirmationForm(): boolean {
    return this.evaluationType === EvaluationType.CONFIRMATION;
  }

  getConfirmationScaleName(scale: number): string {
    switch (scale) {
      case 0:
        return 'Fail/ Repeat';
      case 1:
        return 'Good/Pass';
      case 2:
        return 'Excellent/Pass';
      default:
        return scale.toString();
    }

  }

  showCannotEdit() {
    this.openSnackBar('Confirmation result are generated automatically based on panels evaluation. Edit is not allowed.');
    return false;
  }

  confirmEvaluation(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Submitting the form will finalize the result of this presentation. Edit is not allowed after this. Are you sure to confirm the evaluation? ',
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.onSubmit();
      }
    });
  }
  openMarkingScheme(): void {
    const dialogRef = this.dialog.open(MarkingSchemeDialogComponent);
  }
}
