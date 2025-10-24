import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  standalone: false,
})
export class Layout implements OnInit, OnDestroy{
  
  slideMenu() {
    const menu = document.querySelector('.msidenav') as HTMLElement;
    if (menu) {
      menu.style.left = menu.style.left === '0px' ? '-250px' : '0px';
    }
  }

  private authenticationSub: Subscription;
  userAuthenticated = false;
  constructor(private authService: AuthService){}

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

  logout(){
    this.authService.logout();
  }

}
