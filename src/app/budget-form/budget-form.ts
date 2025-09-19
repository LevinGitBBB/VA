import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetDataService } from '../shared/budget-data.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetEntry } from '../shared/budget-entry.model';
import { Editbudget } from '../editbudget/editbudget';


@Component({
  selector: 'app-budget-form',
  standalone: false,
  templateUrl: './budget-form.html',
  styleUrls: ['./budget-form.css']
})
export class BudgetForm implements OnInit {

  @Output() addItem = new EventEmitter<{ title: string; value: number }>();

  budgetForm: FormGroup;
  editMode = false;
  budgetEntry: BudgetEntry;
  paramId: number; 

  groups = [
    { id: 1, name: 'Fixkosten' },
    { id: 2, name: 'Freizeit' },
    { id: 3, name: 'Miete' },
  ];

  constructor(private budgetDataService: BudgetDataService, private router: Router, private activatedRoute: ActivatedRoute, private Editbudget: Editbudget) {}

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(paramMap.has ('id')){
        this.editMode = true; 
        this.paramId = +paramMap.get('id')!;
        this.budgetEntry = this.budgetDataService.getBudgetEntry(this.paramId);
        this.Editbudget.showForm = !this.Editbudget.showForm;
      } 
      else{
        this.editMode = false;
      }
    })



    const groups = 
    this.budgetForm = new FormGroup({
      group: new FormControl(this.editMode ? this.budgetEntry.group : null, Validators.required), 
      title: new FormControl(this.editMode ? this.budgetEntry.title : null, [Validators.required]),
      value: new FormControl(this.editMode ? this.budgetEntry.value : null, [
        Validators.required,
        Validators.pattern(/^-?\d+(\.\d+)?$/)
      ])
    });
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      /*console.log(this.budgetForm)*/
      const newEntry = new BudgetEntry(this.budgetForm.value.group.name, this.budgetForm.value.title, this.budgetForm.value.value);
      this.budgetDataService.onAddBudgetEntry(newEntry);
    }
  }
}
