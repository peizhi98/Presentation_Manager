import {Component, OnInit} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Select, Store} from '@ngxs/store';
import {ScheduleState} from '../../../../store/schedule/schedule.store';
import {Observable} from 'rxjs';
import {PresentationModel} from '../../../../model/presentation/presentation.model';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  presentationId: number;
  presentationModel: PresentationModel;


  @Select(ScheduleState.getPresentationId)
  presentationId$: Observable<number>;

  constructor(private presentationService: PresentationService, private store: Store) {
  }

  ngOnInit(): void {
    this.presentationId$.subscribe(id => {
      if (id) {
        this.presentationService
          .getPresentation(id)
          .subscribe(resp => {
            this.presentationModel = resp.data;
            console.log(resp);
          });
      }
      console.log(id);
    });
    console.log(this.presentationId);

  }

}
