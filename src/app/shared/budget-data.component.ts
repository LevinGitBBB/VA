import { Injectable } from "@angular/core";
import { BudgetEntry } from "./budget-entry.model";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        budgetEntries: BudgetEntry[] = [
            new BudgetEntry("Fixkosten", "Miete", 1450), 
            new BudgetEntry("Freizeit", "Kino", 50),
            new BudgetEntry("Freizeit", "Netflix", 20) 
        ]        
}