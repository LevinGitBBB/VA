import { NgModule, provideBrowserGlobalErrorListeners  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Third-party modules
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgToastModule } from 'ng-angular-popup';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

// Routing
import { AppRoutingModule } from './app-routing-module';

// Components
import { App } from './app';
import { Layout } from './layout/layout';
import { Home } from './home/home';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { Reader } from './reader/reader';
import { Editbudget } from './editbudget/editbudget';
import { Welcome } from './welcome/welcome';
import { Expenses } from './expense/expense';

// Interceptors / services
import { AuthInterceptor } from './shared/auth-interceptor';
import { Groups } from './groups/groups';

@NgModule({
  declarations: [
    App,
    Layout,
    Home,
    Login,
    SignUp,
    Reader,
    Editbudget,
    Welcome,
    Expenses,
    Groups
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    NgApexchartsModule,
    NgToastModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
