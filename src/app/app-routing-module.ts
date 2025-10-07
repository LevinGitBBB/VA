import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editbudget } from './editbudget/editbudget';
import { Home } from './home/home';
import { Reader } from './reader/reader';


const routes: Routes = [
  { path: '', component: Home },      // Home page
  { path: 'edit-budget', component: Editbudget }, // Edit Budget page
  {path: "edit-budget/:id", component: Editbudget},
  {path: "reader", component: Reader}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
