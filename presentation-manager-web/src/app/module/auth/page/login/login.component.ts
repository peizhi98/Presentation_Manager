import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../../../../store/auth/auth.store';
import {RouteConstant} from '../../../../../assets/constant/route.contant';
import {Router} from '@angular/router';
import {Login} from '../../../../store/auth/auth.action';
import {Observable} from 'rxjs';
import {ProgressBarLoading, ProgressBarStopLoading, ShowSnackBar} from '../../../../store/app/app.action';
import {UserService} from '../../../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  register = false;

  username: string;
  password: string;
  confirmPassword: string;

  @Select(AuthState.isAuth)
  isAuth$: Observable<boolean>;

  constructor(private userService: UserService,
              private matSnackBar: MatSnackBar,
              private store: Store,
              private router: Router) {

  }


  ngOnInit(): void {
    this.isAuth$.subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate([RouteConstant.SCHEDULE_VIEW_ROUTE]);
      }
    });
  }

  registerUser(): void {
    if (this.password === this.confirmPassword) {
      console.log('resp');
      this.store.dispatch(new ProgressBarLoading());
      this.userService.register(this.username, this.password).subscribe((resp) => {
        console.log(resp);
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          console.log(resp);
          this.clearInput();
        }
        this.store.dispatch(new ShowSnackBar(resp.message));
        this.store.dispatch(new ProgressBarStopLoading());
      });
    }
  }

  login(): void {
    if (this.password && this.username) {
      this.store.dispatch(new ProgressBarLoading());
      // this.store.dispatch(new SetUser(null));
      this.store.dispatch(new Login(this.username, this.password));
    }
  }

  switchLogin(): void {
    this.register = false;
    this.clearInput();
  }

  switchRegister(): void {
    this.register = true;
    this.clearInput();
  }

  clearInput(): void {
    this.username = null;
    this.password = null;
    this.confirmPassword = null;
  }


}
