import {Component, OnInit} from '@angular/core';
import {TestService} from './service/test.service';
import {AuthService} from './service/auth.service';
import {Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {AuthState} from './store/auth/auth.store';
import {Logout} from './store/auth/auth.action';
import {RouteConstant} from '../assets/constant/route.contant';
import {AppState} from './store/app/app.store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'presentation-manager-web';
  routeConstant = RouteConstant;
  progressBarMode = 'determinate';

  @Select(AppState.getProgressBarStatus)
  isLoading$: Observable<boolean>;

  constructor(private router: Router,
              private testService: TestService,
              private userService: AuthService,
              private store: Store,) {
  }

  ngOnInit(): void {
    this.isLoading$.subscribe(isLoading => {
      console.log(isLoading);
      if (isLoading) {
        this.progressBarMode = 'indeterminate';
      } else {
        this.progressBarMode = 'determinate';
      }

    });
  }

  isAuth(): boolean {
    // return this.userService.auth();
    return this.store.selectSnapshot(AuthState.isAuth);
  }

  logout(): void {
    this.store.dispatch(new Logout());
    this.router.navigate([RouteConstant.LOGIN]);
  }
}
