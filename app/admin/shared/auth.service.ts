import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError,  Observable } from 'rxjs';
import { tap, /*catchError*/ } from 'rxjs/operators';

import { AppStateService } from './app-state.service';

@Injectable()
export class AuthService {
	authData: IAuthData = {
		isLogin: false
	};
	constructor(
		private appState: AppStateService,
		private http: HttpClient) {}

	getData() {
		return this.authData;
	}

	login(password:string):any {
		return this.http.post<any>(this.appState.state.apiRoot + 'admin/login', {password: password});
	}
}

interface IAuthData {
	isLogin: boolean
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(tap(evt => {
    	return observableOf(evt);
    }, err => {
    	if (err instanceof HttpErrorResponse) {
    		if (err.status === 401) {
    			window.location.href = window['_basehref'] + 'dangnhap';
    		}
    		return observableThrowError('API ERROR');
    	}
    }));
  }
}