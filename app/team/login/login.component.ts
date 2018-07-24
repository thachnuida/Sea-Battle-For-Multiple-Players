import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../shared/auth.service';
import { AppStateService } from '../shared/app-state.service';

@Component({
	// moduleId: module.id,
	selector: 'my-admin-login',
	templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
	chienDichList = [];
	loginData = {
		chien_dich_id: 0,
		name: '',
		password: ''
	};
	password = '';
	isLoginError = false;

	constructor(
		private appState: AppStateService,
		private auth: AuthService,
		private router: Router,
		private http: HttpClient) {}

	ngOnInit() {
		// Get list chien dich
		this.http.get<any>(this.appState.state.apiRoot + 'team/chiendichdangmo')
		.subscribe(data => {
			this.chienDichList = data;
			if (this.chienDichList.length) {
				this.loginData.chien_dich_id = this.chienDichList[0].id;
			}
		});
	}

	login() {
		this.isLoginError = false;
		console.log(this.loginData);
		this.auth.login(this.loginData)
		.subscribe(data => {
			if (data.result) {
				this.auth.authData.isLogin = true;
				this.router.navigateByUrl('/bando');
			} else {
				this.isLoginError = true;
			}
		})
	}
}