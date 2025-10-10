import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class UserStoreService{
    
    private fullName$ = new BehaviorSubject<string>("");
    private userId$ = new BehaviorSubject<string>("");

    constructor() {}

    public getUserIdFromStore(){
        return this.userId$.asObservable();
    }


    public setUserIdForStore(userId:string){
        this.userId$.next(userId); 
    }

    
    public getFullNameFromStore(){
        return this.fullName$.asObservable();
    }

    public setFullNameForStore(fullname:string){
        this.fullName$.next(fullname);
    }

}