import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
	// moduleId: module.id,
	selector: 'my-admin-login',
	templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
	password = '';
	isLoginError = false;

	constructor(
		private auth: AuthService,
		private router: Router) {}

	ngOnInit() {}

	login() {
		this.isLoginError = false;
		this.auth.login(this.password)
		.subscribe(data => {
			if (data.result) {
				this.auth.authData.isLogin = true;
				this.router.navigateByUrl('/chiendich');
			} else {
				this.isLoginError = true;
			}
		})
	}
}