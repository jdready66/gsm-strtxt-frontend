import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { authInterceptorProviders } from './interceptors/auth.interceptor';
import { faLock, faPencil, faUserCircle, faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MustMatchValidatorDirective } from './directives/must-match-validator.directive';
import { PasswordModalComponent } from './pages/password-modal/password-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifyCustomerComponent } from './pages/notify-customer/notify-customer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AdminComponent,
    DetailComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    MustMatchValidatorDirective,
    PasswordModalComponent,
    NotifyCustomerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  entryComponents: [PasswordModalComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserCircle, faUserPlus, faPencil, faLock, faXmark);
  }
}
