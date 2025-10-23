import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { Editbudget } from './editbudget/editbudget';
import { ReactiveFormsModule } from '@angular/forms';
import { Home } from './home/home';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Reader } from './reader/reader';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { AuthInterceptor } from './shared/auth-interceptor';
import { Welcome } from './welcome/welcome';
import { NgToastModule} from 'ng-angular-popup';
import { Ausgaben } from './ausgaben/ausgaben';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    App,
    Header,
    Editbudget,
    Home,
    Reader,
    Login,
    SignUp,
    Welcome,
    Ausgaben
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    NgApexchartsModule,
    NgToastModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
