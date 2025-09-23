import { Injectable } from "@angular/core";
import { BudgetEntry } from "./budget-entry.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        public maxId: number; 

        constructor(private http: HttpClient){}

        budgetSubject = new Subject<BudgetEntry[]>();

        budgetEntries: BudgetEntry[] = [];
        
        onDelete(id: number){
            this.http.delete<{message: string}>('http://localhost:3000/remove-entry/' + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getBudgetEntries();
            }) 
        }

        onAddBudgetEntry(budgetEntry: BudgetEntry){
            this.http.get<{maxId: number}>('http://localhost:3000/max-id').subscribe((jsonData) => {
                budgetEntry.id = jsonData.maxId + 1;

                this.http.post<{message: string}>('http://localhost:3000/add-entry', budgetEntry).subscribe ((jsonData) => {
                    console.log(budgetEntry);
                    this.getBudgetEntries();
                })

            })
            
            this.budgetEntries.push(budgetEntry);
            this.budgetSubject.next(this.budgetEntries);
        }

        getBudgetEntries() {
            this.http.get<{ budgetEntries: BudgetEntry[] }>('http://localhost:3000/budget-entries')
                .subscribe((jsonData) => {
                this.budgetEntries = jsonData.budgetEntries; 
                this.budgetSubject.next(this.budgetEntries);
            });
         }


        updateBudgetEntry(index: number, updatedEntry: BudgetEntry) {
            if (index >= 0 && index < this.budgetEntries.length) {
            this.budgetEntries[index] = updatedEntry;
            this.budgetSubject.next(this.budgetEntries);
        }
}

}