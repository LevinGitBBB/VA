import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { Editbudget } from './editbudget/editbudget';
import { ReactiveFormsModule } from '@angular/forms';
import { Home } from './home/home';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    Header,
    Editbudget,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
