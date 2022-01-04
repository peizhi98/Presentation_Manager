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
        return 'Presentation Evaluation';
      case EvaluationType.REPORT:
        return 'Report Evaluation';
    }
  }

}
