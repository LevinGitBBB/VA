import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';
import { Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-editbudget',
  standalone: false,
  templateUrl: './editbudget.html',
  styleUrl: './editbudget.css'
})
export class Editbudget implements OnInit, OnDestroy{

  budgetEntries: BudgetEntry[];
  budgetSubscription = new Subscription();

  constructor(private budgetDataService: BudgetDataService) {}

  ngOnInit(): void{
    this.budgetSubscription = this.budgetDataService.budgetSubject.subscribe(diaryEntries => {
      this.budgetEntries = this.budgetEntries;
    })
    this.budgetEntries = this.budgetDataService.budgetEntries
  }
  ngOnDestroy(): void {
    this.budgetSubscription.unsubscribe();
  }

  onDelete(index: number){
    this.budgetDataService.onDelete(index);
  }
}