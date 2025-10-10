import { Injectable } from "@angular/core";
import { BudgetEntry } from "./budget-entry.model";
import { map, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ValueChangeEvent } from "@angular/forms";
import { UserStoreService } from "./user-store.service";
import { AuthService } from "./auth-service";

@Injectable({providedIn:"root"})
export class BudgetDataService{

        public maxId: number; 

        constructor(private http: HttpClient, private authService: AuthService){}

        budgetSubject = new Subject<BudgetEntry[]>();

        budgetEntries: BudgetEntry[] = [];


        
        onDelete(id: string){
            this.http.delete<{message: string}>('http://localhost:3000/remove-entry/' + id).subscribe ((jsonData) =>{
                console.log(jsonData.message);
                this.getBudgetEntries();
            }) 
        }

        onAddBudgetEntry(budgetEntry: BudgetEntry){


                this.http.post<{message: string}>('http://localhost:3000/add-entry', budgetEntry).subscribe ((jsonData) => {
                    console.log(budgetEntry);
                    this.getBudgetEntries();
                })
            
            this.budgetEntries.push(budgetEntry);
            this.budgetSubject.next(this.budgetEntries);
        }

        getBudgetEntries() {

            const token = this.authService.getToken();

            if (!token) {
                console.error('No JWT token available. User might not be logged in.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            
            this.http.get<{ budgetEntries: any}>('http://localhost:3000/budget-entries', { headers })
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


        getBudgetEntry(id: string){
            const index = this.budgetEntries.findIndex(el => {
                return el.id == id; 
            })
            return this.budgetEntries[index];
        }

        updateEntry(id: string, entry: BudgetEntry) {
        this.http.put<{message: string}>('http://localhost:3000/update-entry/' + id, entry).subscribe((jsonData) => {
            console.log(jsonData.message);
            this.getBudgetEntries();
        })
        }

}