import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editbudget } from './editbudget/editbudget';
import { Home } from './home/home';
import { Reader } from './reader/reader';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { RouteGuard } from './shared/route-guard';
import { Welcome } from './welcome/welcome';

const routes: Routes = [
  { path: '', component: Welcome},      
  { path: 'edit-budget', component: Editbudget, canActivate: [RouteGuard]}, 
  {path: "edit-budget/:id", component: Editbudget, canActivate: [RouteGuard]},
  {path: "reader", component: Reader, canActivate: [RouteGuard]},
  {path: "login", component: Login},
  {path: "sign-up", component: SignUp},
  {path: "welcome", component: Welcome},
  {path: "home", component: Home, canActivate: [RouteGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule {}
