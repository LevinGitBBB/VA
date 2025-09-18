import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { Editbudget } from './editbudget/editbudget';
import { BudgetForm } from './budget-form/budget-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Home } from './home/home';

@NgModule({
  declarations: [
    App,
    Header,
    Editbudget,
    BudgetForm,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
