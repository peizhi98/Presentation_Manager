import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import * as XLSX from 'xlsx';
import {LoadingDialogUtil} from '../../app/util/loading-dialog.util';

@Directive({
  selector: '[appReadexcel]',
  exportAs: 'readexcel',
})
export class ReadExcelDirective {
  excelObservable: Observable<any>;
  @Output() eventEmitter = new EventEmitter();

  constructor(private loadingUtil: LoadingDialogUtil) {
  }

  @HostListener('change', ['$event.target'])
  onChange(target: HTMLInputElement): void {
    const file = target.files[0];
    this.excelObservable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    this.excelObservable.subscribe((d) => {
      this.eventEmitter.emit(d);
    });
  }

  readFile(file: File, subscriber: Subscriber<any>): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Loading Excel Data...');
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});

      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);

      subscriber.next(data);
      subscriber.complete();
      loadingRef.close();
    };
  }
}
