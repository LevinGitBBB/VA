import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editbudget',
  standalone: false,
  templateUrl: './editbudget.html',
  styleUrls: ['./editbudget.css',
    '../ImportStyles/customButtons.css'
  ]
})
export class Editbudget implements OnInit, OnDestroy {

  showForm = false;
  budgetEntries: BudgetEntry[] = [];
  budgetSubscription: Subscription;

  constructor(private budgetDataService: BudgetDataService, private router: Router) {}

  ngOnInit(): void {

    this.budgetEntries = this.budgetDataService.budgetEntries;

    this.budgetSubscription = this.budgetDataService.budgetSubject.subscribe(
      (entries: BudgetEntry[]) => {
        this.budgetEntries = entries;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.budgetSubscription) {
      this.budgetSubscription.unsubscribe();
    }
  }

  onDelete(index: number): void {
    this.budgetDataService.onDelete(index);
  }

  onEdit(index: number){
    this.router.navigate(["edit-budget", index])
  }


  toggleForm() {
    this.showForm = !this.showForm;
  }
}