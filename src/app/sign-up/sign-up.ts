import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth-service';
import { Router } from '@angular/router';
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  signupForm: FormGroup;
  success : any;
  constructor(private authService: AuthService, private router: Router, private toast: NgToastService){}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl('', [Validators.required]), 
      'password': new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.authService.signupUser(this.signupForm.value.username, this.signupForm.value.password)
      .subscribe({
        next: (res) => {
          this.toast.success("Thank you for signing up, please continue to Login", 'Success', 5000);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toast.danger("This Username has already been used", 'Error Signing up', 5000);
        }
      });
  }


}
