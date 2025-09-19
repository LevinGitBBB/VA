import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editbudget } from './editbudget/editbudget';
import { Home } from './home/home';
import { BudgetForm } from './budget-form/budget-form';


const routes: Routes = [
  { path: '', component: Home },      // Home page
  { path: 'edit-budget', component: Editbudget }, // Edit Budget page
  { path: '**', redirectTo: '' },               // wildcard fallback
  {path: "edit/:id", component: Editbudget} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
