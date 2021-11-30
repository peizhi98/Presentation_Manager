import {Component, OnInit} from '@angular/core';
import {PresentationMode, ScheduleModel, ScheduleType} from '../../../../model/schedule.model';
import {ScheduleService} from '../../../../service/schedule.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Store} from '@ngxs/store';
import {ShowSnackBar} from '../../../../store/app/app.action';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  scheduleModel: ScheduleModel = new ScheduleModel();
  presentationTypeList = [];
  scheduleTypeList = [];

  constructor(private scheduleService: ScheduleService, private store: Store) {
  }

  ngOnInit(): void {
    this.presentationTypeList.push(PresentationMode.PHYSICAL, PresentationMode.ONLINE);
    this.scheduleTypeList.push(ScheduleType.FYP, ScheduleType.MASTER_DISSERTATION);
  }

  save(): void {
    this.scheduleService.addOrEditSchedule(this.scheduleModel).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        this.scheduleModel = new ScheduleModel();
        this.store.dispatch(new ShowSnackBar('Successfully Created a New Presentation Schedule.'));
      } else {
        this.store.dispatch(new ShowSnackBar('Failed to Created a New Presentation Schedule.'));
      }
    });
  }


}
