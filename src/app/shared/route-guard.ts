import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth-service";
import { Injectable } from "@angular/core";

@Injectable()
export class RouteGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<boolean | UrlTree> {
        const isAuthenticated = this.authService.getIsAuthenticated();
        if (!isAuthenticated) {
        this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }
}
