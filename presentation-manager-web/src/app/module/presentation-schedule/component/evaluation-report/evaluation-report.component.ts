import {Component, OnInit} from '@angular/core';
import {EvaluationReportModel, FYPEvaluationReportModel} from '../../../../model/evaluation/evaluation.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html',
  styleUrls: ['./evaluation-report.component.scss']
})
export class EvaluationReportComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'symbolLabel', 'nameLabel'];
  dataSource = ELEMENT_DATA;

  constructor() {
  }

  ngOnInit(): void {
    const evaluationList: FYPEvaluationReportModel[] = [];
    const fypEvaluation: FYPEvaluationReportModel = new FYPEvaluationReportModel();
    fypEvaluation.mark = 30;
    fypEvaluation.studentName = 'Ali';
    fypEvaluation.title = 'example title';
    const report: EvaluationReportModel = new EvaluationReportModel();
    report.mark = 15;
    report.evaluatorName = 'Su Moon Ting';
    const presentationEvaluation: EvaluationReportModel[] = [];
    const preEv1: EvaluationReportModel = new EvaluationReportModel();
    preEv1.mark = 10;
    preEv1.evaluatorName = 'Ong';
    presentationEvaluation.push(preEv1);
    const preEv2: EvaluationReportModel = new EvaluationReportModel();
    preEv2.mark = 40;
    preEv2.evaluatorName = 'Sukshim';
    evaluationList.push(fypEvaluation);
    presentationEvaluation.push(preEv2);
    const fypEvaluation2: FYPEvaluationReportModel = new FYPEvaluationReportModel();
    fypEvaluation2.mark = 30;
    fypEvaluation2.studentName = 'Ali';
    fypEvaluation2.title = 'example title';
    const report2: EvaluationReportModel = new EvaluationReportModel();
    report2.mark = 15;
    report2.evaluatorName = 'Su Moon Ting';
    const presentationEvaluation2: EvaluationReportModel[] = [];
    const preEv12: EvaluationReportModel = new EvaluationReportModel();
    preEv12.mark = 10;
    preEv12.evaluatorName = 'Ong';
    const preEv22: EvaluationReportModel = new EvaluationReportModel();
    preEv22.mark = 40;
    preEv22.evaluatorName = 'Sukshim';
    presentationEvaluation.push(preEv12);
    presentationEvaluation.push(preEv22);
    evaluationList.push(fypEvaluation2);
  }

}
