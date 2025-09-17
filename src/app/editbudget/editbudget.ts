import { Component, OnInit } from '@angular/core';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';

@Component({
  selector: 'app-editbudget',
  standalone: false,
  templateUrl: './editbudget.html',
  styleUrl: './editbudget.css'
})
export class Editbudget implements OnInit{

  budgetEntries: BudgetEntry[];

  constructor(private budgetDataService: BudgetDataService) {}

  ngOnInit(): void{
    this.budgetEntries = this.budgetDataService.budgetEntries
  }
}
