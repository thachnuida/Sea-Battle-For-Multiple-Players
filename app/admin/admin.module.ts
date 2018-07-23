import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { AdminComponent } from './admin.component';
import { ChienDichComponent } from './chien-dich/chien-dich.component';
import { ChienDichDetailComponent } from './chien-dich/chien-dich-detail.component';
import { ChienDichModalComponent } from './chien-dich/chien-dich-modal.component';

import { LoginComponent } from './login/login.component';

import { AppStateService } from './shared/app-state.service';
import { AuthService, AuthInterceptor } from './shared/auth.service';

import { routing } from './admin.routing';

@NgModule({
  declarations: [
    AdminComponent,
    ChienDichComponent,
    ChienDichDetailComponent,
    ChienDichModalComponent,
    LoginComponent
  ],
  entryComponents: [
    ChienDichModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    routing
  ],
  providers: [
  	{ provide: APP_BASE_HREF, useValue: window['_basehref'] || '' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AppStateService,
    AuthService
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule {
  constructor(
    private appStateService: AppStateService) {

    this.appStateService.set({apiRoot: '/ban-may-bay/api/'});

  }
}
