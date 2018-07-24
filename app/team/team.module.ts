import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { TeamComponent } from './team.component';
import { BandoComponent } from './bando/bando.component';
import { LoginComponent } from './login/login.component';
import { InfoComponent } from './info/info.component';

import { AppStateService } from './shared/app-state.service';
import { AuthService, AuthInterceptor } from './shared/auth.service';

import { routing } from './team.routing';

@NgModule({
  declarations: [
    TeamComponent,
    LoginComponent,
    BandoComponent,
    InfoComponent
  ],
  entryComponents: [

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
  bootstrap: [TeamComponent]
})
export class TeamModule {
  constructor(
    private appStateService: AppStateService) {

    this.appStateService.set({apiRoot: '/ban-may-bay/api/'});

  }
}
