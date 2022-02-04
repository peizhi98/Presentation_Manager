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
import {UserModel} from '../../../../model/user/user.model';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  name: string;
  confirmPassword: string;

  @Select(AuthState.isAuth)
  isAuth$: Observable<boolean>;

  constructor(private userService: UserService,
              private matSnackBar: MatSnackBar,
              private store: Store,
              private router: Router,
              private loadingUtil: LoadingDialogUtil) {

  }


  ngOnInit(): void {
    this.isAuth$.subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate([RouteConstant.DASHBOARD_ROUTE]);
      }
    });
  }

  login(): void {
    if (this.password && this.username) {
      this.store.dispatch(new ProgressBarLoading());
      // this.store.dispatch(new SetUser(null));
      this.store.dispatch(new Login(this.username, this.password));
    }
  }

  clearInput(): void {
    this.username = null;
    this.password = null;
    this.confirmPassword = null;
    this.name = null;
  }


}
