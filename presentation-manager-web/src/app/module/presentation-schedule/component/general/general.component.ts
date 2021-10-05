import {Component, Input, OnInit} from '@angular/core';
import {ChangeContentTitle} from '../../../../store/schedule/schedule.action';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  @Input() scheduleId: number;
  manageCriteria = false;
  general = true;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
  }

  switchManageCriteria(): void {
    this.store.dispatch(new ChangeContentTitle('Manage Evaluation Criteria'));
    this.manageCriteria = true;
    this.general = false;
  }

  switchGeneral(): void {
    this.store.dispatch(new ChangeContentTitle('General'));
    this.manageCriteria = false;
    this.general = true;
  }

}
