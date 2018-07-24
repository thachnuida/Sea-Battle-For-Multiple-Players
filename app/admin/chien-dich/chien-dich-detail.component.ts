import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AppStateService } from '../shared/app-state.service';
import { ChienDichModalComponent } from './chien-dich-modal.component';

@Component({
	// moduleId: module.id,
	selector: 'my-chien-dich-detail',
	templateUrl: 'chien-dich-detail.component.html'
})
export class ChienDichDetailComponent implements OnInit {
	chiendich:any = {};
	doiChoi:any = {};
	doiChoiList = [];
	backup:any;

	constructor(
		private modal: NgbModal,
		private http: HttpClient,
		private appState: AppStateService,
		private route: ActivatedRoute
		) {}

	ngOnInit() {
		this.route.params.subscribe(p => {
			// Get chien dich
			this.http.get<any>(this.appState.state.apiRoot + 'admin/chiendich/' + p.id)
			.subscribe(data => {
				this.chiendich = data;
			});

			// Get danh sach doi choi
			this.http.get<any>(this.appState.state.apiRoot + 'admin/chiendich/' + p.id + '/team')
			.subscribe(data => {
				this.doiChoiList = data;
			});			
		});
	}

	updateChienDich() {
		this.backup = Object.assign({}, this.chiendich);
		let modalRef = this.modal.open(ChienDichModalComponent);
		modalRef.componentInstance.currentChiendich = this.chiendich;

		modalRef.result.then(item => {
			// Save chien dich
			this.http.post<any>(this.appState.state.apiRoot + 'admin/chiendich/' + this.chiendich.id, item)
			.subscribe(data => {
				Object.assign(this.chiendich, data);

			});
		}, () => {
			// Phuc hoi thong tin cu
			Object.assign(this.chiendich, this.backup);

		});
	}

	makePassword() {
		let text = "";
		let possible = "0123456789";

		for (let i = 0; i < 8; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	addDoiChoi() {
		if (!this.doiChoi.name || !this.doiChoi.name.trim()) return;
		this.doiChoi.name = this.doiChoi.name.toLowerCase().replace(/ /g, '-');
		this.doiChoi.password = this.makePassword();
		this.http.post<any>(this.appState.state.apiRoot + `admin/chiendich/${this.chiendich.id}/team`, this.doiChoi)
		.subscribe(data => {
			this.doiChoiList.push(data);
			this.doiChoi = {};
		});
	}

	removeDoiChoi(team) {
		let check = confirm(`Có muốn xóa ${team.name} không?`);
		if (check) {
			this.http.delete<any>(this.appState.state.apiRoot + `admin/chiendich/${this.chiendich.id}/team/${team.id}`)
			.subscribe(() => {
				this.doiChoiList.splice(this.doiChoiList.indexOf(team), 1);
			});
		}
	}
}