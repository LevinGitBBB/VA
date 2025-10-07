import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { Editbudget } from './editbudget/editbudget';
import { ReactiveFormsModule } from '@angular/forms';
import { Home } from './home/home';
import { HttpClientModule } from '@angular/common/http';
import { Reader } from './reader/reader';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    App,
    Header,
    Editbudget,
    Home,
    Reader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    NgApexchartsModule  
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
