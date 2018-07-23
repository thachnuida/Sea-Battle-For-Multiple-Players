import { RouterModule, Routes } from '@angular/router';

import { ChienDichComponent } from './chien-dich/chien-dich.component';
import { ChienDichDetailComponent } from './chien-dich/chien-dich-detail.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/chiendich',
		pathMatch: 'full'
	},
	{
		path: 'chiendich',
		component: ChienDichComponent
	},
	{
		path: 'chiendich/:id',
		component: ChienDichDetailComponent
	},
	{
		path: 'dangnhap',
		component: LoginComponent
	}

];

export const routing = RouterModule.forRoot(routes);