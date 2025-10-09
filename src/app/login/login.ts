import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css', '../ImportStyles/customButtons.css']
})
export class Login {

  loginForm: FormGroup; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]), 
      'password': new FormControl('', [Validators.required])
    }) 
  }

  onSubmit(){
    this.authService.loginUser(this.loginForm.value.username, this.loginForm.value.password)
  }
}
