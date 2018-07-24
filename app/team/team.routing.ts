import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { BandoComponent } from './bando/bando.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/bando',
		pathMatch: 'full'
	},
	{
		path: 'dangnhap',
		component: LoginComponent
	},
	{
		path: 'bando',
		component: BandoComponent
	},
	{
		path: 'thongtin',
		component: InfoComponent
	}

];

export const routing = RouterModule.forRoot(routes);