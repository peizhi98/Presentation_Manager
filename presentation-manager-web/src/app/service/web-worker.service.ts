// import {Injectable} from '@angular/core';
// import {Observable, Subscriber} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class WebWorkerService {
//
//
//   getPresentationDetailsFromData(presentationData: any[], scheduleId: number): any {
//     return new Observable((subscriber: Subscriber<any>) => {
//       if (typeof Worker !== 'undefined') {
//         // Create a new
//         const worker = new Worker('../web-worker/presentation-xlsx.worker', {type: 'module'});
//         worker.postMessage({presentationData, scheduleId});
//         worker.onmessage = ({data}) => {
//           subscriber.next(data);
//           subscriber.complete();
//         };
//
//       } else {
//         // Web Workers are not supported in this environment.
//         // You should add a fallback so that your program still executes correctly.
//       }
//     });
//
//   }
// }
