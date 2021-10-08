import {MatDialog} from '@angular/material/dialog';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private matDialog: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(err => {
        this.matDialog.closeAll();
        return throwError(err);
      }));
  }
}
