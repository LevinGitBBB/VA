import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth-service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy{

  private authenticationSub: Subscription;
  userAuthenticated = false;
  constructor(private authService: AuthService){}

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

}
