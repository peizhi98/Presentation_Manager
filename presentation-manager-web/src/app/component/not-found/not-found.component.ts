import {Component, OnInit} from '@angular/core';
import {RouteConstant} from '../../../assets/constant/route.contant';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  routeConstant = RouteConstant;

  constructor() {
  }

  ngOnInit(): void {
  }

}
