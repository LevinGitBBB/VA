import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BudgetDataService } from '../shared/budget-data.component';
import { AuthService } from '../shared/auth-service';
import { UserStoreService } from '../shared/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { ExpenseEntry } from '../shared/models/expense-entry.model';
import { GroupEntry } from '../shared/models/group-entry.model';

@Component({
  selector: 'app-expense',
  standalone: false,
  templateUrl: './expense.html',
  styleUrls: ['../layout/layout.css', './expense.css', '../ImportStyles/customButtons.css']
})
export class Expenses implements OnInit, OnDestroy {

  private authenticationSub: Subscription; 
  isAuthenticated = false;

  showForm = false;
  expenseEntries: ExpenseEntry[] = [];
  expenseSubscription: Subscription;
  groupSubscription: Subscription;
  editingEntryId: string; 
  expenseForm: FormGroup;
  editMode = false;
  expenseEntryIndex: number | null = null;
  groupEntries: GroupEntry[] = [];
  

  private paramId: string; 
  expenseEntry: ExpenseEntry; 
  currentUserId: string;

  constructor(
    private budgetDataService: BudgetDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userStore: UserStoreService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.budgetDataService.getExpenseEntries();
      this.budgetDataService.getGroupEntries();


    // 2️⃣ Subscribe to budget entries updates
    this.expenseSubscription = this.budgetDataService.expenseSubject.subscribe(
      (entries: ExpenseEntry[]) => {
        this.expenseEntries = entries;
      }
    );

    this.groupSubscription = this.budgetDataService.groupSubject.subscribe(
      (entries: GroupEntry[]) => {
        this.groupEntries = entries;
      }
    );

    // 3️⃣ Initialize the form
    this.expenseForm = new FormGroup({
      group: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      value: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+(\.\d+)?$/)
      ])
    });

    // 4️⃣ Subscribe to route params and control form visibility
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.editMode = true;
        this.paramId = paramMap.get('id')!;

        // Find the budget entry by ID
        const expenseEntry = this.budgetDataService.getExpenseEntry(this.paramId);
        if (expenseEntry) {
          this.showForm = true; // ensures form shows immediately
          this.expenseEntryIndex = this.expenseEntries.indexOf(expenseEntry);

          const selectedGroup = this.groupEntries.find(g => g.groupName === expenseEntry.group) || null;

          // Patch form values
          this.expenseForm.patchValue({
            group: selectedGroup,
            title: expenseEntry.title,
            value: expenseEntry.value
          });
        }
      } else {
        this.editMode = false;
        this.showForm = false;
        this.expenseEntryIndex = null;
        this.expenseForm.reset();
      }
    });

    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.isAuthenticated = status;
    })
    this.isAuthenticated = this.authService.getIsAuthenticated();

      this.userStore.getUserIdFromStore()
      .subscribe(val=> {
        let currentUserIdFromToken = this.authService.getUserIdFromToken();
        this.currentUserId = val || currentUserIdFromToken
      })
  }

  ngOnDestroy(): void {
    if (this.expenseSubscription) this.expenseSubscription.unsubscribe();
    this.authenticationSub.unsubscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  onDelete(id: string): void {
    this.budgetDataService.onDeleteExpenseEntries(id);
    this.toast.success(String("Expense removed"),  'Success', 5000);
    if (this.editMode && this.paramId === id) {
      this.resetForm();
    }
  }


  onEdit(id: string): void {
    this.editingEntryId = id;
    this.startEdit(id);
  }

  private startEdit(id: string): void {
    const expenseEntry = this.expenseEntries.find(be => be.id === id);
    if (!expenseEntry) return;

    this.expenseEntryIndex = this.expenseEntries.indexOf(expenseEntry);

    const selectedGroup = this.groupEntries.find(g => g.groupName === expenseEntry.group) || null;

    this.expenseForm.patchValue({
      group: selectedGroup,
      title: expenseEntry.title,
      value: expenseEntry.value
    });

    this.paramId = id.toString();
    this.editMode = true;
    this.showForm = true;
  }


  private resetForm(): void {
    this.editMode = false;
    this.expenseEntryIndex = null;
    this.expenseForm.reset();
    this.showForm = false;
    this.router.navigate(['/expense'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (!this.expenseForm.valid) return;

    const formValue = this.expenseForm.value;
    const entry = new ExpenseEntry(this.editMode ? this.paramId : '', this.currentUserId, formValue.group.groupName, formValue.title, formValue.value);

    if (this.editMode) {
      // Update local array
      if (this.expenseEntryIndex !== null) {
        this.expenseEntries[this.expenseEntryIndex] = entry;
        this.budgetDataService.budgetSubject.next(this.expenseEntries);
      }
      this.budgetDataService.updateExpenseEntry(entry.id, entry);
      this.toast.success(String("Expense updated"),  'Success', 5000);
    } else {
      this.budgetDataService.onAddExpenseEntry(entry);
      this.toast.success(String("Expense added"),  'Success', 5000);
    }
    
    this.resetForm();
  }

}
