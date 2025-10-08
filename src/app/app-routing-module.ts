import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editbudget } from './editbudget/editbudget';
import { Home } from './home/home';
import { Reader } from './reader/reader';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';

const routes: Routes = [
  { path: '', component: Home },      // Home page
  { path: 'edit-budget', component: Editbudget }, // Edit Budget page
  {path: "edit-budget/:id", component: Editbudget},
  {path: "reader", component: Reader},
  {path: "login", component: Login},
  {path: "sign-up", component: SignUp}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
