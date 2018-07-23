import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AppStateService } from '../shared/app-state.service';
import { ChienDichModalComponent } from './chien-dich-modal.component';

@Component({
	moduleId: module.id,
	selector: 'my-chien-dich',
	templateUrl: 'chien-dich.component.html'
})
export class ChienDichComponent implements OnInit {
	chiendichList = [];
	backup: any;

	constructor(
		private modal: NgbModal,
		private http: HttpClient,
		private appState: AppStateService) {}

	ngOnInit() {
		this.getList();
	}

	getList() {
		this.http.get<any>(this.appState.state.apiRoot + 'admin/chiendich')
		.subscribe(data => this.chiendichList = data);
	}

	openChienDichForm(chiendich) {
		let modalRef = this.modal.open(ChienDichModalComponent);
		modalRef.componentInstance.currentChiendich = chiendich;

		modalRef.result.then(item => {
			let url = this.appState.state.apiRoot + 'admin/chiendich';
			if (item.id) {
				url += '/' + item.id;
			}
			// Save chien dich
			this.http.post<any>(url, item)
			.subscribe(data => {
				if (item.id) {
					Object.assign(chiendich, data);
				} else {
					this.chiendichList.push(data);
				}
			});
		}, () => {
			// Phuc hoi thong tin cu
			if (chiendich.id) {
				Object.assign(chiendich, this.backup);
			}
		});
	}

	addChienDich() {
		this.openChienDichForm({});
	}

	updateChienDich(item) {
		this.backup = Object.assign({}, item);
		this.openChienDichForm(item);
	}
}