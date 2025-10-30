import { Injectable } from "@angular/core";
import { BudgetEntry } from "./models/budget-entry.model";
import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ValueChangeEvent } from "@angular/forms";
import { UserStoreService } from "./user-store.service";
import { AuthService } from "./auth-service";
import { environment } from "./environment";
import { ExpenseEntry } from "./models/expense-entry.model";
import { GroupEntry } from "./models/group-entry.model";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        public maxId: number; 

        constructor(private http: HttpClient, private authService: AuthService){}

        budgetSubject = new Subject<BudgetEntry[]>();
        expenseSubject = new Subject<ExpenseEntry[]>();
        groupSubject = new Subject<GroupEntry[]>();
        incomeSubject = new Subject<number>();


        income: number; 
        budgetEntries: BudgetEntry[] = [];
        expenseEntries: ExpenseEntry[] = [];
        groupEntries: GroupEntry[] = [];

        localhost = environment.host


        
        onDeleteBudgetEntries(id: string){
            this.http.delete<{message: string}>(`http://${this.localhost}:3000/remove-entry/` + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getBudgetEntries();
            }) 
        }

        onDeleteExpenseEntries(id: string){
            this.http.delete<{message: string}>(`http://${this.localhost}:3000/remove-expense/` + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getExpenseEntries();
            }) 
        }        

        onAddBudgetEntry(budgetEntry: BudgetEntry){
                this.http.post<{message: string}>(`http://${this.localhost}:3000/add-entry`, budgetEntry).subscribe ((jsonData) => {
                    console.log(budgetEntry);
                    this.getBudgetEntries();
                })
            
            this.budgetEntries.push(budgetEntry);
            this.budgetSubject.next(this.budgetEntries);
        }

        onAddExpenseEntry(expenseEntry: ExpenseEntry){
                this.http.post<{message: string}>(`http://${this.localhost}:3000/add-expense`, expenseEntry).subscribe ((jsonData) => {
                    console.log(expenseEntry);
                    this.getBudgetEntries();
                })
            
            this.expenseEntries.push(expenseEntry);
            this.expenseSubject.next(this.expenseEntries);
        }

        getBudgetEntries() {

            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            
            this.http.get<{ budgetEntries: any}>(`http://${this.localhost}:3000/budget-entries`, { headers })
            .pipe(map((responseData) => {
                return responseData.budgetEntries.map((entry: {group: string; title: string; value: string; _id: string}) => {
                    return {
                        group: entry.group, 
                        title: entry.title, 
                        value: entry.value, 
                        id: entry._id
                    }
                })
            }))
            .subscribe((updateResponse) => {
                this.budgetEntries = updateResponse; 
                this.budgetSubject.next(this.budgetEntries);
            });
        }

        getExpenseEntries() {

            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            
            this.http.get<{ expenseEntries: any}>(`http://${this.localhost}:3000/expense-entries`, { headers })
            .pipe(map((responseData) => {
                return responseData.expenseEntries.map((entry: {group: string; title: string; value: string; _id: string}) => {
                    return {
                        group: entry.group, 
                        title: entry.title, 
                        value: entry.value, 
                        id: entry._id
                    }
                })
            }))
            .subscribe((updateResponse) => {
                this.expenseEntries = updateResponse; 
                this.expenseSubject.next(this.expenseEntries);
            });
        }

        getBudgetEntry(id: string){
            const index = this.budgetEntries.findIndex(el => {
                return el.id == id; 
            })
            return this.budgetEntries[index];
        }

        getExpenseEntry(id: string){
            const index = this.expenseEntries.findIndex(el => {
                return el.id == id; 
            })
            return this.expenseEntries[index];
        }

        updateBudgetEntry(id: string, entry: BudgetEntry) {
        this.http.put<{message: string}>(`http://${this.localhost}:3000/update-entry/` + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getBudgetEntries();
        })
        }

        updateExpenseEntry(id: string, entry: ExpenseEntry) {
        this.http.put<{message: string}>(`http://${this.localhost}:3000/update-expense/` + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getExpenseEntries();
        })
        }

        setIncome(income: number) {
        this.http.post<{ message: string }>(`http://${this.localhost}:3000/upload-income`, { income }).subscribe((jsonData) => {
            console.log("Saved Income as: " + income + "CHF");
            this.getIncome();
            });
        }

        getIncome() {
            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            this.http.get<{ income: number }>(`http://${this.localhost}:3000/income`, { headers })
                .pipe(
                    map((responseData) => { return responseData.income;})
                )
                .subscribe((incomeValue) => {
                    this.income = incomeValue;
                    this.incomeSubject.next(this.income);
                });
        }

        /////////////////////Groups/////////////////////////////
        onAddGroupEntry(groupEntry: GroupEntry){
            this.http.post<{message: string}>(`http://${this.localhost}:3000/add-group`, groupEntry).subscribe ((jsonData) => {
                this.getBudgetEntries();
            })
            
            this.groupEntries.push(groupEntry);
            this.groupSubject.next(this.groupEntries);
        }

        onDeleteGroupEntries(id: string){
            this.http.delete<{message: string}>(`http://${this.localhost}:3000/remove-group/` + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getGroupEntries();
            }) 
        }

        getGroupEntries() {

            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            
            this.http.get<{ groupEntries: any}>(`http://${this.localhost}:3000/group-entries`, { headers })
            .pipe(map((responseData) => {
                return responseData.groupEntries.map((entry: {groupName: string; _id: string}) => {
                    return {
                        groupName: entry.groupName, 
                        id: entry._id
                    }
                })
            }))
            .subscribe((updateResponse) => {
                this.groupEntries = updateResponse; 
                this.groupSubject.next(this.groupEntries);
            });
        }





}