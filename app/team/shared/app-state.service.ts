import { Injectable } from '@angular/core';

@Injectable()
export class AppStateService {
	state: IAppSate = {
		apiRoot: ''
	};

	constructor() {}

	set(state: IAppSate) {
		Object.assign(this.state, state);
	}
}

interface IAppSate {
	apiRoot: string
}