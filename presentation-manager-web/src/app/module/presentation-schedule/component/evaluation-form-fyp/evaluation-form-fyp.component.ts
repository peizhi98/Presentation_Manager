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

@Component({
  selector: 'app-evaluation-form-fyp',
  templateUrl: './evaluation-form-fyp.component.html',
  styleUrls: ['./evaluation-form-fyp.component.css']
})
export class EvaluationFormFypComponent implements OnInit, OnDestroy {
  scheduleId: number;
  evaluationType: EvaluationType;
  evaluationFormModel: EvaluationFormModel;
  evaluationModel: EvaluationModel;
  criteriaModels: CriterionModel[] = [];
  scaleOptions = [1, 2, 3, 4, 5];
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
  readonly CRITERION_EVALUATION_ID = 'criterionEvaluationId';
  readonly CRITERIA_EVALUATION = 'criteriaEvaluation';
  readonly MAX_GAP = 'maxGap';
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
              private formBuilder: FormBuilder, private store: Store) {
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    //
    // this.scheduleId$.subscribe(id => {
    //   if (id) {
    //     console.log(id);
    //     this.scheduleId = id;
    //     this.evaluationFormMode$.subscribe(mode => {
    //       if (mode) {
    //         console.log(mode);
    //         this.evaluationFormMode = mode;
    //         this.evaluationType$.subscribe(type => {
    //             if (type) {
    //               console.log(type);
    //               this.evaluationType = type;
    //               if ((this.evaluationType === EvaluationType.PRESENTATION
    //                 || this.evaluationType === EvaluationType.REPORT)) {
    //                 this.initFormGroup();
    //               }
    //             }
    //           }
    //         );
    //       }
    //     });
    //   }
    // });

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
    if ((this.evaluationType === EvaluationType.PRESENTATION
      || this.evaluationType === EvaluationType.REPORT)
      && this.scheduleId
      && this.evaluationType
      && this.evaluationFormMode) {
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
            if (!this.evaluationModel.id) {
              this.evaluationModel.presentationId = this.presentationId;
            }
            if (!this.evaluationModel.criterionEvaluationModelList) {
              this.evaluationModel.criterionEvaluationModelList = [];
            }
            // this.criteriaModels = this.evaluationFormModel.criterionModels;
            // build form
            this.evaluationForm = this.formBuilder.group({
              maxGap: this.formBuilder.control(156),
              criteriaEvaluation: this.formBuilder.array([])
            });
            this.evaluationModel.criterionEvaluationModelList.forEach(c => {
              this.addCriterionEvaluationControl(c);
            });
            this.currentForm = this.evaluationForm;
          }
          loadingRef.close();
        });
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
    if (this.evaluationType === EvaluationType.PRESENTATION) {
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
          //build form
          this.evaluationFormEditingForm = this.formBuilder.group({
            maxGap: this.formBuilder.control(this.evaluationFormModel.maxGap),
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
      weightage: this.formBuilder.control(criterionModel.weightage, [Validators.required, Validators.pattern("^[0-9]*$")]),
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
          if (this.evaluationType === EvaluationType.PRESENTATION) {
            total += (c.get(this.RATING).value / 5) * c.get(this.WEIGHTAGE).value;
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
    }

  }

  submitEvaluation(): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Submitting...');
    if (this.evaluationFormMode === EvaluationFormMode.EVALUATE) {
      const evaluationModel: EvaluationModel = new EvaluationModel();
      evaluationModel.id = this.evaluationModel.id;
      evaluationModel.presentationId = this.evaluationModel.presentationId;
      evaluationModel.evaluationFormId = this.evaluationModel.evaluationFormId;
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
          this.openSnackBar('Failed to save evaluation criteria');
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

  isPresentation(): boolean {
    return this.evaluationType === EvaluationType.PRESENTATION;
  }

  isReport(): boolean {
    return this.evaluationType === EvaluationType.REPORT;
  }

  // get EvaluationFormMode(): any {
  //   return EvaluationFormMode;
  // }

}
