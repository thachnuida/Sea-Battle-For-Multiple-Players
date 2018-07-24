import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppStateService } from '../shared/app-state.service';

@Component({
	selector: 'my-info',
	templateUrl: 'info.component.html'
})
export class InfoComponent implements OnInit {
	info:any = {};

	constructor(
		private http: HttpClient,
		private appSate: AppStateService
		) {}

	ngOnInit() {
		// Lay thong tin
		this.http.get<any>(this.appSate.state.apiRoot + 'team/campinfo')
		.subscribe(data => {
			this.info = data;
		});
	}
}