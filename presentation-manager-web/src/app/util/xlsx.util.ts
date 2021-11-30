import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';

@Injectable({providedIn: 'root'})
export class XlsxUtil {
  constructor() {
  }

  readFile(file: File): any {
    return new Observable((subscriber: Subscriber<any>) => {
      if (typeof Worker !== 'undefined') {
        // Create a new
        const worker = new Worker('../web-worker/util.worker', {type: 'module'});
        worker.postMessage({file});
        worker.onmessage = ({data}) => {
          subscriber.next(data);
          subscriber.complete();
        };
      } else {
        // Web Workers are not supported in this environment.
        // You should add a fallback so that your program still executes correctly.
      }
      // fileReader.onload = (e) => {
      //   const bufferArray = e.target.result;
      //
      //   const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
      //
      //   const wsname: string = wb.SheetNames[0];
      //
      //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      //
      //   const data = XLSX.utils.sheet_to_json(ws);
      //
      //   subscriber.next(data);
      //   subscriber.complete();
      // };
    });
    // excelObservable.subscribe((d) => {
    //   console.log(d);
    //   return d;
    // });
  }
}
