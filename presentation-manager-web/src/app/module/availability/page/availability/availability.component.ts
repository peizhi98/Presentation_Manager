import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {LecturerModel} from '../../../../model/role/lecturer.model';
import {UserState} from '../../../../store/user/user.store';
import {Observable} from 'rxjs';
import {PatchUserFromBackend} from '../../../../store/user/user.action';
import {AvailabilityService} from '../../../../service/availability.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  lecturers: LecturerModel[] = [];
  filteredLecturers: LecturerModel[] = [];
  @Select(UserState.getLecturer)
  lecturers$: Observable<LecturerModel[]>;
  findUser: LecturerModel;

  constructor(private store: Store, private availabilityService: AvailabilityService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.dispatch(new PatchUserFromBackend());
    this.lecturers$.subscribe(lec => {
      this.lecturers = lec;
    });

  }

  applyFilter(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredLecturers = inputValue ? this.filterLecturers(inputValue) : this.lecturers.slice();
  }

  private filterLecturers(value: string): LecturerModel[] {
    const filterValue = value.trim().toLowerCase();
    const filteredLec = [];
    this.lecturers.forEach(lec => {
      const searchSpace = (lec.name) ? (lec.name + lec.email) : lec.email;
      if (searchSpace.trim().toLowerCase().includes(filterValue)) {
        filteredLec.push(lec);
      }
    });
    return filteredLec;
  }

  viewAvailability(id: number): void {
    this.router.navigate([id], {relativeTo: this.activatedRoute});
  }
}
