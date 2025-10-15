import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthModel } from "./auth-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt"
import { UserStoreService } from "./user-store.service";
import { environment } from "./environment";

@Injectable({providedIn:"root"})
export class AuthService{

    private token: string; 
    private authenticatedSub = new Subject<boolean>();
    private isAuthenticated = false; 
    private logoutTimer: any; 
    private userPayload: any;

    localhost = environment.host

    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    getAuthenticatedSub(){
        return this.authenticatedSub.asObservable();
    }
    getToken(){
        return this.token;
    }

    constructor(private http: HttpClient, private router: Router, private userStore: UserStoreService){
        try{
        this.userPayload= this.decodedToken();
        }
        catch{}
    }

    signupUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};

        this.http.post(`http://${this.localhost}:3000/sign-up`, authData).subscribe( res=> {
            console.log(res);
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password}; 

        this.http.post<{token: string, expiresIn: number}>(`http://${this.localhost}:3000/login/`, authData)
            .subscribe(res => {
                this.token = res.token;
                if(this.token){
                    this.authenticatedSub.next(true);
                    this.isAuthenticated = true;
                    this.router.navigate(['/home'])
                    this.logoutTimer = setTimeout(() => {this.logout()}, res.expiresIn * 1000);
                    const now = new Date(); 
                    const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));
                    this.storeLoginDetails(this.token, expiresDate)
                    
                    const tokenPayload = this.decodedToken();
                    this.userStore.setFullNameForStore(tokenPayload.username)
                    this.userStore.setUserIdForStore(tokenPayload.userId)
                }
            })
    }

    logout(){
        this.token = '';
        this.isAuthenticated = false;
        this.authenticatedSub.next(false);
        this.router.navigate(['/welcome']);
        clearTimeout(this.logoutTimer);
        this.clearLoginDetails();
    }

    storeLoginDetails(token: string, expirationDate: Date){
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString()); 
    }

    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }

    getLocalStorageData(){
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        if(!token || !expiresIn){
            return; 
        }
        return{
            'token': token, 
            'expiresIn': new Date(expiresIn)
        }
    }

    authenticateFromLocalStorage(){
        const localStorageData = this.getLocalStorageData();
        if(localStorageData){
            const now = new Date();
            const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

            if(expiresIn > 0){
                this.token = localStorageData.token;
                this.isAuthenticated = true;
                this.authenticatedSub.next(true);
                this.logoutTimer = setTimeout(() => {
                    this.logout();
                }, expiresIn);
            }
        }
    }

    decodedToken(){
        const jwtHelper = new JwtHelperService();
        const localStorageData= this.getLocalStorageData()!
        const token = localStorageData.token; 
        console.log(jwtHelper.decodeToken(token))
        return jwtHelper.decodeToken(token)
    }


    getFullNameFromToken(){
        if(this.userPayload)
            return this.userPayload.username;
    }

    getUserIdFromToken(){
        if(this.userPayload)
            return this.userPayload.userId;
    }


}