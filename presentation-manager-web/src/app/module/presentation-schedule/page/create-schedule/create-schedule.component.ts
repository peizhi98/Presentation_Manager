import {Component, OnInit} from '@angular/core';
import {PresentationMode, ScheduleModel, ScheduleType} from '../../../../model/schedule/schedule.model';
import {ScheduleService} from '../../../../service/schedule.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Store} from '@ngxs/store';
import {ShowSnackBar} from '../../../../store/app/app.action';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteConstant} from '../../../../../assets/constant/route.contant';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  scheduleModel: ScheduleModel = new ScheduleModel();
  presentationTypeList = [];
  scheduleTypeList = [];
  currentYear = (new Date()).getFullYear();
  academicYearsSelection = [];

  constructor(private scheduleService: ScheduleService, private store: Store, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    for (let i = -1; i < 9; i++) {
      this.academicYearsSelection.push(this.currentYear + i);
    }
    this.presentationTypeList.push(PresentationMode.PHYSICAL, PresentationMode.ONLINE);
    this.scheduleTypeList.push(ScheduleType.FYP, ScheduleType.MASTER_DISSERTATION);
  }

  save(): void {
    this.scheduleService.addOrEditSchedule(this.scheduleModel).subscribe(resp => {
      if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
        // this.scheduleModel = new ScheduleModel();
        console.log(resp.data);
        this.store.dispatch(new ShowSnackBar('Successfully Created a New Presentation Schedule.'));
        this.router.navigate([resp.data.id+'/'+RouteConstant.PRESENTATION_VIEW], {relativeTo: this.activatedRoute.parent});
      } else {
        this.store.dispatch(new ShowSnackBar('Failed to Created a New Presentation Schedule.'));
      }
    });
  }

  get ScheduleType() {
    return ScheduleType;
  }

}
