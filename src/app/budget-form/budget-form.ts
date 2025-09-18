import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-budget-form',
  standalone: false,
  templateUrl: './budget-form.html',
  styleUrls: ['./budget-form.css']
})
export class BudgetForm implements OnInit {

  @Output() addItem = new EventEmitter<{ title: string; value: number }>();

  budgetForm: FormGroup;

  ngOnInit(): void {
    this.budgetForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+(\.\d+)?$/)
      ])
    });
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      console.log(this.budgetForm)
    }
  }
}
