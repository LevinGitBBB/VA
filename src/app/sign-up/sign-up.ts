import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  signupForm: FormGroup;
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl('', [Validators.required]), 
      'password': new FormControl('', [Validators.required])
    })
  }

  onSubmit(){
    this.authService.signupUser(this.signupForm.value.username, this.signupForm.value.password);
  }



}
