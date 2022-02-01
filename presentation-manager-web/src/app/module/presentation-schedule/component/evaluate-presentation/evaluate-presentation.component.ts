import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {ChangeEvaluationFormMode, ChangeEvaluationType} from '../../../../store/evaluation/evaluation.action';
import {EvaluationFormMode, EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-evaluate-presentation',
  templateUrl: './evaluate-presentation.component.html',
  styleUrls: ['./evaluate-presentation.component.css']
})
export class EvaluatePresentationComponent implements OnInit {
  evaluationType;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangeEvaluationFormMode(EvaluationFormMode.EVALUATE));
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.evaluationType = params.form;
        this.store.dispatch(new ChangeEvaluationType(this.evaluationType));
      }
    });


  }

  getTitle(): string {
    switch (this.evaluationType) {
      case EvaluationType.PRESENTATION:
        return 'VIVA Assessment Form';
      case EvaluationType.REPORT:
        return 'Supervisor Assessment Form';
      case EvaluationType.PANEL:
        return 'Evaluation Form';
      case EvaluationType.CONFIRMATION:
        return 'Confirmation Panel Evaluation Form';
      default:
        return 'Invalid Form Name';
    }
  }

  isFYP(): boolean {
    return this.evaluationType === EvaluationType.PRESENTATION || this.evaluationType === EvaluationType.REPORT;
  }

  isMaster(): boolean {
    return this.evaluationType === EvaluationType.PANEL || this.evaluationType === EvaluationType.CONFIRMATION;
  }
}
