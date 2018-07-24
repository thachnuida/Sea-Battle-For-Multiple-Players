import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppStateService } from '../shared/app-state.service';

@Component({
	selector: 'my-bando',
	templateUrl: 'bando.component.html',
	styleUrls: ['bando.scss']
})
export class BandoComponent implements OnInit {
	isLoading = true;
	mode = 'caidat';

	chienDich:any = {};
	cells = [];

	constructor(
		private http: HttpClient,
		private appSate: AppStateService
		) {}

	ngOnInit() {
		// Lay thong tin chien dich
		this.http.get<any>(this.appSate.state.apiRoot + 'team/chiendich')
		.subscribe(data => {
			data.so_hang = Number(data.so_hang);
			data.so_cot = Number(data.so_cot);
			data.so_bom_moi_doi = Number(data.so_bom_moi_doi);
			data.so_may_bay_moi_doi = Number(data.so_may_bay_moi_doi);
			data.so_may_bay_con_lai = data.so_may_bay_moi_doi;
			data.so_bom_con_lai = data.so_bom_moi_doi;
			data.so_may_bay_ban_duoc = 0;

			this.chienDich = data;

			// General cells
			for (let i = 1; i <= data.so_hang; i++) {
				for (let j = 1; j <= data.so_cot; j++) {
					this.cells.push({
						hang: i,
						cot: j,
						style: {top: (i - 1) * 30, left: (j - 1) * 30}
					});
				}
			}

			// Lay may bay hien co cua doi
			this.http.get<any>(this.appSate.state.apiRoot + 'team/airplane')
			.subscribe(data => {
				data.forEach(airplane => {
					let found = this.cells.find(cell => {
						return cell.hang == airplane.hang && cell.cot == airplane.cot;
					});
					if (found) {
						found.hasAirPlane = true;
						this.chienDich.so_may_bay_con_lai --;
					}

				});

				this.isLoading = false;
			});
		});
	}

	toggleAirPlane(cell) {
		let hasAirPlane = !cell.hasAirPlane;
		
		if (hasAirPlane && this.chienDich.so_may_bay_con_lai < 1) {
			return alert('Bạn đã dùng hết máy bay.');
		}

		cell.hasAirPlane = hasAirPlane;
		cell.isLoading = true;
		this.http.post<any>(this.appSate.state.apiRoot + 'team/airplane', cell)
		.subscribe(() => {
			cell.isLoading = false;
			
			if (hasAirPlane) {
				this.chienDich.so_may_bay_con_lai --;			
			} else {
				this.chienDich.so_may_bay_con_lai ++;
			}

		}, (err) => {
			if (err.error && err.error.message) {
				alert(err.error.message);
			} else {
				alert('Co loi khi luu thong tin may bay');
			}
			cell.isLoading = false;
			cell.hasAirPlane = !hasAirPlane;
		});
	}

	// Chuyen sang che do tan cong
	changeMode() {
		this.isLoading = true;
		// Kiem tra da duoc tan cong chua
		this.http.get<any>(this.appSate.state.apiRoot + 'team/chiendich')
		.subscribe(data => {
			if (data.cho_phep_tan_cong == 1) {
				this.mode = 'tancong';
				// Lay bom da dat
				this.http.get<any>(this.appSate.state.apiRoot + 'team/bom')
				.subscribe(data => {
					data.forEach(bom => {
						let found = this.cells.find(cell => {
							return cell.hang == bom.hang && cell.cot == bom.cot;
						});
						if (found) {
							found.hasBom = true;
							found.so_may_bay_ban_duoc = bom.so_may_bay_ban_duoc;
							this.chienDich.so_may_bay_ban_duoc +=  Number(bom.so_may_bay_ban_duoc);
							this.chienDich.so_bom_con_lai --;
						}

					});

					this.isLoading = false;
				});
			} else {
				alert('Chua duoc phep tan cong');
			}
		});
	}

	addBom(cell) {
		if (cell.hasBom) return;
		cell.isLoading = true;
		this.http.post<any>(this.appSate.state.apiRoot + 'team/bom', cell)
		.subscribe(data => {
			cell.hasBom = true;
			cell.isLoading = false;
			this.chienDich.so_bom_con_lai --;
			this.chienDich.so_may_bay_ban_duoc += data.so_may_bay_ban_duoc;
			alert(`Ban trung ${data.so_may_bay_ban_duoc} may bay.`);
		}, (err) => {
			if (err.error && err.error.message) {
				alert(err.error.message);
			} else {
				alert('Co loi khi dat bom');
			}
			cell.isLoading = false;
		});
	}

}