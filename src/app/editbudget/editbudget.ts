import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';

@Component({
  selector: 'app-editbudget',
  templateUrl: './editbudget.html',
  standalone: false,
  styleUrls: ['./editbudget.css', '../ImportStyles/customButtons.css']
})
export class Editbudget implements OnInit, OnDestroy {

  showForm = false;
  budgetEntries: BudgetEntry[] = [];
  budgetSubscription: Subscription;

  budgetForm: FormGroup;
  editMode = false;
  budgetEntryIndex: number | null = null;

  groups = [
    { id: 1, name: 'Fixkosten' },
    { id: 2, name: 'Freizeit' },
    { id: 3, name: 'Miete' },
  ];

  constructor(
    private budgetDataService: BudgetDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.budgetEntries = this.budgetDataService.budgetEntries;

    this.budgetSubscription = this.budgetDataService.budgetSubject.subscribe(
      (entries: BudgetEntry[]) => {
        this.budgetEntries = entries;
      }
    );

    this.budgetForm = new FormGroup({
      group: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      value: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+(\.\d+)?$/)
      ])
    });

    // Check if route has 'id' for edit
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        const id = +paramMap.get('id')!;
        this.startEdit(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.budgetSubscription) this.budgetSubscription.unsubscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  onDelete(index: number): void {
    this.budgetDataService.onDelete(index);
    if (this.editMode && this.budgetEntryIndex === index) this.resetForm();
  }

  onEdit(index: number): void {
    this.startEdit(index);
    // Optional: scroll to form
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  private startEdit(index: number): void {
    this.editMode = true;
    this.showForm = true;
    this.budgetEntryIndex = index;
    const budgetEntry = this.budgetEntries[index];

    const selectedGroup = this.groups.find(g => g.name === budgetEntry.group) || null;

    this.budgetForm.patchValue({
      group: selectedGroup,
      title: budgetEntry.title,
      value: budgetEntry.value
    });

    // Update route to /edit-budget/:id
    this.router.navigate(['/edit-budget', index], { replaceUrl: true });
  }

  private resetForm(): void {
    this.editMode = false;
    this.budgetEntryIndex = null;
    this.budgetForm.reset();
    this.showForm = false;
    // Reset route to /edit-budget without id
    this.router.navigate(['/edit-budget'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (!this.budgetForm.valid) return;

    const formValue = this.budgetForm.value;
    const newEntry = new BudgetEntry(formValue.group.name, formValue.title, formValue.value);

    if (this.editMode && this.budgetEntryIndex !== null) {
      this.budgetEntries[this.budgetEntryIndex] = newEntry;
      this.budgetDataService.budgetSubject.next(this.budgetEntries);
    } else {
      this.budgetDataService.onAddBudgetEntry(newEntry);
    }

    this.resetForm();
  }
}
