import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editbudget } from './editbudget/editbudget';
import { BudgetForm } from './budget-form/budget-form';

const routes: Routes = [
  {path:"", component: Editbudget},
  {path:"data-entry", component: BudgetForm}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }