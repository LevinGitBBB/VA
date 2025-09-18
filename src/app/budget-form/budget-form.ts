import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetDataService } from '../shared/budget-data.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-form',
  standalone: false,
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css'
})
export class BudgetForm implements OnInit{

  budgetForm: FormGroup;
  
  constructor(private budgetDataService: BudgetDataService, private router: Router){}

  ngOnInit(): void {
    this.budgetForm = new FormGroup({
      "title": new FormControl(null, [Validators.required]),
      "value": new FormControl(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)])
    })
  }

  onSubmit(){
    if(this.budgetForm.valid){
          console.log(this.budgetForm)
    }
  }
}
