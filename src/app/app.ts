import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './shared/auth-service';
import { ToasterPosition } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  
  
  constructor(private authService: AuthService){}
    
  ngOnInit(): void {
    this.authService.authenticateFromLocalStorage();
  }

  protected readonly title = signal('VA');

  ToasterPosition = ToasterPosition; 
}

