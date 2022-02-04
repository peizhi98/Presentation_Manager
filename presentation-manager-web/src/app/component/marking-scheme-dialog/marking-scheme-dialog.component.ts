import {Component, OnInit} from '@angular/core';

export interface Scheme {
  markRange: string;
  result: string;
}

const ELEMENT_DATA: Scheme[] = [
  {markRange: '75 - 100', result: 'Excellent/ Pass'},
  {markRange: '65 - 74', result: 'Good/ Pass'},
  {markRange: '< 75', result: 'Fail/ Repeat'}
];

@Component({
  selector: 'app-marking-scheme-dialog',
  templateUrl: './marking-scheme-dialog.component.html',
  styleUrls: ['./marking-scheme-dialog.component.css']
})
export class MarkingSchemeDialogComponent implements OnInit {
  displayedColumns: string[] = ['markRange', 'result'];
  dataSource = ELEMENT_DATA;

  constructor() {
  }

  ngOnInit(): void {
    console.log('marking scheme');
  }

}
