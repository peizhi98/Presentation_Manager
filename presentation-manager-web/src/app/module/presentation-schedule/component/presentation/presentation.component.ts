import {Component, OnDestroy, OnInit} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Store} from '@ngxs/store';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {ActivatedRoute} from '@angular/router';
import {Constant} from '../../../../../assets/constant/app.constant';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {EvaluationType} from '../../../../model/evaluation/evaluation-form.model';
import {SetCurrentPresentation} from '../../../../store/presentation/presentation.action';
import {SystemRole} from '../../../../model/user/user.model';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit, OnDestroy {
  presentationId: number;
  presentationModel: PresentationModel;
  timeFormat = Constant.TIME_FORMAT;
  routeConstant = RouteConstant;
  constant = Constant;

  constructor(private presentationService: PresentationService, private store: Store, private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetCurrentPresentation(null, null, null));
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.presentationId = params.id;
        this.presentationService
          .getPresentation(this.presentationId)
          .subscribe(resp => {
            if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
              this.store.dispatch(new SetCurrentPresentation(this.presentationId, resp.data.supervisorModel, resp.data.panelModels));
              this.presentationModel = resp.data;
            }
            console.log(resp);
          });
      }
    });

  }

  get EvaluationType() {
    return EvaluationType;
  }

  get SystemRole() {
    return SystemRole;
  }

}
