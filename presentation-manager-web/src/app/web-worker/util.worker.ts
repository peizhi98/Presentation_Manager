/// <reference lib="webworker" />
import * as XLSX from 'xlsx';
import {Observable, Subscriber} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

function readFile(file: File) {
  return new Observable((subscriber: Subscriber<any>) => {
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
    };
  });

  // const fileReader = new FileReader();
  // fileReader.readAsArrayBuffer(file);
  // let data = null;
  // fileReader.onload = (e) => {
  //   const bufferArray = e.target.result;
  //
  //   const wb: XLSX.WorkBook = XLSX.read(bufferArray, {type: 'buffer'});
  //
  //   const wsname: string = wb.SheetNames[0];
  //
  //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //   console.log(XLSX.utils.sheet_to_json(ws));
  //   data = XLSX.utils.sheet_to_json(ws);
  // };
  // console.log(data);
  // return data;
}

addEventListener('message', ({data}) => {
  readFile(data.file).pipe(take(1)).subscribe((d) => {
    postMessage(d);
  });
});
