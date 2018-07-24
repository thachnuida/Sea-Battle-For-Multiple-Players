import { Component, OnInit } from '@angular/core';

import { AuthService } from './shared/auth.service';

@Component({
	selector: 'my-team',
	templateUrl: 'team.component.html',
	styleUrls: ['team.scss']
})
export class TeamComponent implements OnInit {
	constructor(
		private authService: AuthService
		) {}

	ngOnInit() {
		
	}

	logout() {
		this.authService.logout();
	}
}