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

@NgModule({
  declarations: [
    App,
    Header,
    Editbudget,
    Home,
    Reader,
    Login,
    SignUp,
    Welcome
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    NgApexchartsModule  
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
