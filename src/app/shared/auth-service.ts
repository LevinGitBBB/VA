import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthModel } from "./auth-model";
import { Subject } from "rxjs";


@Injectable({providedIn:"root"})
export class AuthService{

    private token: string; 
    private authenticatedSub = new Subject<boolean>();
    private isAuthenticated = false; 
    
    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    getAuthenticatedSub(){
        return this.authenticatedSub.asObservable();
    }
    getToken(){
        return this.token;
    }

    constructor(private http: HttpClient){}

    signupUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};

        this.http.post('http://localhost:3000/sign-up', authData).subscribe( res=> {
            console.log(res);
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password}; 

        this.http.post<{token: string}>('http://localhost:3000/login/', authData)
            .subscribe(res => {
                this.token = res.token;
                if(this.token){
                    this.authenticatedSub.next(true);
                    this.isAuthenticated = true;
                }
            })
    }
}