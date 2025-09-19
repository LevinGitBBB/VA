import { Injectable } from "@angular/core";
import { BudgetEntry } from "./budget-entry.model";
import { Subject } from "rxjs";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        budgetSubject = new Subject<BudgetEntry[]>();

        budgetEntries: BudgetEntry[] = [
            new BudgetEntry("Fixkosten", "Miete", 1450), 
            new BudgetEntry("Freizeit", "Kino", 50),
            new BudgetEntry("Freizeit", "Netflix", 20) 
        ]
        
        onDelete(index: number){
            this.budgetEntries.splice(index, 1);
            this.budgetSubject.next(this.budgetEntries);
        }

        onAddBudgetEntry(budgetEntry: BudgetEntry){
            this.budgetEntries.push(budgetEntry);
            this.budgetSubject.next(this.budgetEntries);
        }

        getBudgetEntry(index: number){
            return{...this.budgetEntries[index]}
        }
}