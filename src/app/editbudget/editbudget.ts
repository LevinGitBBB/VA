import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';
import { AuthService } from '../shared/auth-service';
import { UserStoreService } from '../shared/user-store.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-editbudget',
  templateUrl: './editbudget.html',
  standalone: false,
  styleUrls: ['./editbudget.css', '../ImportStyles/customButtons.css']
})
export class Editbudget implements OnInit, OnDestroy {

  private authenticationSub: Subscription; 
  isAuthenticated = false;

  showForm = false;
  budgetEntries: BudgetEntry[] = [];
  budgetSubscription: Subscription;
  incomeSubscription: Subscription;
  income: number; 
  budgetForm: FormGroup;
  editMode = false;
  budgetEntryIndex: number | null = null;
  showIncomeSave = false;
  private paramId: string; 
  budgetEntry: BudgetEntry; 
  currentUserId: string;

  groups = [
    { id: 1, name: 'Fixkosten' },
    { id: 2, name: 'Freizeit' },
    { id: 3, name: 'Miete' },
  ];

  constructor(
    private budgetDataService: BudgetDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userStore: UserStoreService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.budgetDataService.getBudgetEntries();
    this.budgetDataService.getIncome();

    // 2️⃣ Subscribe to budget entries updates
    this.budgetSubscription = this.budgetDataService.budgetSubject.subscribe(
      (entries: BudgetEntry[]) => {
        this.budgetEntries = entries;
      }
    );

    this.incomeSubscription = this.budgetDataService.incomeSubject.subscribe(
      (incomeValue: number) => {
        this.income = incomeValue;
      }
    );

    // 3️⃣ Initialize the form
    this.budgetForm = new FormGroup({
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
        const budgetEntry = this.budgetDataService.getBudgetEntry(this.paramId);
        if (budgetEntry) {
          this.showForm = true; // ensures form shows immediately
          this.budgetEntryIndex = this.budgetEntries.indexOf(budgetEntry);

          const selectedGroup = this.groups.find(g => g.name === budgetEntry.group) || null;

          // Patch form values
          this.budgetForm.patchValue({
            group: selectedGroup,
            title: budgetEntry.title,
            value: budgetEntry.value
          });
        }
      } else {
        this.editMode = false;
        this.showForm = false;
        this.budgetEntryIndex = null;
        this.budgetForm.reset();
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
    if (this.budgetSubscription) this.budgetSubscription.unsubscribe();
    this.authenticationSub.unsubscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  onDelete(id: string): void {
    this.budgetDataService.onDeleteBudgetEntries(id);
    this.toast.success(String("Budget-Point removed"),  'Success', 5000);
    if (this.editMode && this.paramId === id) {
      this.resetForm();
    }
  }


  onEdit(id: string): void {
    this.startEdit(id);
  }

  private startEdit(id: string): void {
    const budgetEntry = this.budgetEntries.find(be => be.id === id);
    if (!budgetEntry) return;

    this.budgetEntryIndex = this.budgetEntries.indexOf(budgetEntry);

    const selectedGroup = this.groups.find(g => g.name === budgetEntry.group) || null;

    this.budgetForm.patchValue({
      group: selectedGroup,
      title: budgetEntry.title,
      value: budgetEntry.value
    });

    this.paramId = id.toString();
    this.editMode = true;
    this.showForm = true;
  }


  private resetForm(): void {
    this.editMode = false;
    this.budgetEntryIndex = null;
    this.budgetForm.reset();
    this.showForm = false;
    this.router.navigate(['/edit-budget'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (!this.budgetForm.valid) return;

    const formValue = this.budgetForm.value;
    const entry = new BudgetEntry(this.editMode ? this.paramId : '', this.currentUserId, formValue.group.name, formValue.title, formValue.value);

    if (this.editMode) {
      // Update local array
      if (this.budgetEntryIndex !== null) {
        this.budgetEntries[this.budgetEntryIndex] = entry;
        this.budgetDataService.budgetSubject.next(this.budgetEntries);
      }
      this.budgetDataService.updateBudgetEntry(entry.id, entry);
      this.toast.success(String("Budget-Point updated"),  'Success', 5000);
    } else {
      this.budgetDataService.onAddBudgetEntry(entry);
      this.toast.success(String("Budget-Point added"),  'Success', 5000);
    }

    this.resetForm();
  }

  enableIncomeSave(){
    this.showIncomeSave = true
  }

  saveIncome(): void{
    if(this.income){
      this.budgetDataService.setIncome(this.income)
      this.showIncomeSave = false;
    }else{
      this.toast.danger(String("Only Numbers are accepted as Valid Income"),  'Error', 5000);
    }
  }
}
