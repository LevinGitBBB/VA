import { Injectable } from "@angular/core";
import { BudgetEntry } from "./budget-entry.model";
import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ValueChangeEvent } from "@angular/forms";
import { UserStoreService } from "./user-store.service";
import { AuthService } from "./auth-service";
import { environment } from "./environment";
import { AusgabenEntry } from "./ausgaben-entry.model";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        public maxId: number; 

        constructor(private http: HttpClient, private authService: AuthService){}

        budgetSubject = new Subject<BudgetEntry[]>();
        ausgabenSubject = new Subject<AusgabenEntry[]>();
        incomeSubject = new Subject<number>();


        income: number; 
        budgetEntries: BudgetEntry[] = [];
        ausgabenEntries: AusgabenEntry[] = [];

        localhost = environment.host


        
        onDeleteBudgetEntries(id: string){
            this.http.delete<{message: string}>(`http://${this.localhost}:3000/remove-entry/` + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getBudgetEntries();
            }) 
        }

        onDeleteAusgabenEntries(id: string){
            this.http.delete<{message: string}>(`http://${this.localhost}:3000/remove-ausgaben/` + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getAusgabenEntries();
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

        onAddAusgabenEntry(ausgabenEntry: AusgabenEntry){
                this.http.post<{message: string}>(`http://${this.localhost}:3000/add-ausgabe`, ausgabenEntry).subscribe ((jsonData) => {
                    console.log(ausgabenEntry);
                    this.getBudgetEntries();
                })
            
            this.budgetEntries.push(ausgabenEntry);
            this.budgetSubject.next(this.budgetEntries);
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

        getAusgabenEntries() {

            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            
            this.http.get<{ ausgabenEntries: any}>(`http://${this.localhost}:3000/ausgaben-entries`, { headers })
            .pipe(map((responseData) => {
                return responseData.ausgabenEntries.map((entry: {group: string; title: string; value: string; _id: string}) => {
                    return {
                        group: entry.group, 
                        title: entry.title, 
                        value: entry.value, 
                        id: entry._id
                    }
                })
            }))
            .subscribe((updateResponse) => {
                this.ausgabenEntries = updateResponse; 
                this.ausgabenSubject.next(this.ausgabenEntries);
            });
        }

        getBudgetEntry(id: string){
            const index = this.budgetEntries.findIndex(el => {
                return el.id == id; 
            })
            return this.budgetEntries[index];
        }

        getAusgabenEntry(id: string){
            const index = this.ausgabenEntries.findIndex(el => {
                return el.id == id; 
            })
            return this.ausgabenEntries[index];
        }

        updateBudgetEntry(id: string, entry: BudgetEntry) {
        this.http.put<{message: string}>(`http://${this.localhost}:3000/update-entry/` + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getBudgetEntries();
        })
        }

        updateAusgabenEntry(id: string, entry: AusgabenEntry) {
        this.http.put<{message: string}>(`http://${this.localhost}:3000/update-ausgaben/` + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getAusgabenEntries();
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

}