import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	// moduleId: module.id,
	selector: 'my-chien-dich-modal',
	templateUrl: 'chien-dich-modal.component.html'
})
export class ChienDichModalComponent implements OnInit {
	@Input() currentChiendich;

	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit() {
		
	}
}