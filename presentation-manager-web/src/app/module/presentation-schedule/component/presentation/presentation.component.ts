import {Component, OnInit} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Store} from '@ngxs/store';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {SetCurrentPresentation} from '../../../../store/presentation/presentation.action';
import {ActivatedRoute} from '@angular/router';
import {Constant} from '../../../../../assets/constant/app.constant';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  presentationId: number;
  presentationModel: PresentationModel;
  timeFormat=Constant.TIME_FORMAT;

  constructor(private presentationService: PresentationService, private store: Store, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.presentationId = params.id;
        this.store.dispatch(new SetCurrentPresentation(this.presentationId));
        this.presentationService
          .getPresentation(this.presentationId)
          .subscribe(resp => {
            this.presentationModel = resp.data;
            console.log(resp);
          });
      }
    });

  }

}
