import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GroupEntry } from '../shared/models/group-entry.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetDataService } from '../shared/budget-data.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { UserStoreService } from '../shared/user-store.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-groups',
  standalone: false,
  templateUrl: './groups.html',
  styleUrls: ['./groups.css', '../layout/layout.css', '../ImportStyles/customButtons.css']
})
export class Groups {

  private authenticationSub: Subscription; 
  isAuthenticated = false;

  showForm = true;
  groupEntries: GroupEntry[] = [];
  groupSubscription: Subscription;
  editingEntryId: string; 
  groupForm: FormGroup;
  editMode = false;
  groupEntryIndex: number | null = null;
  private paramId: string; 
  groupEntry: GroupEntry; 
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
    this.budgetDataService.getGroupEntries();

    // 2️⃣ Subscribe to budget entries updates
    this.groupSubscription = this.budgetDataService.groupSubject.subscribe(
      (entries: GroupEntry[]) => {
        this.groupEntries = entries;
      }
    );

    // 3️⃣ Initialize the form
    this.groupForm = new FormGroup({
      group: new FormControl(null, Validators.required)
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
    if (this.groupSubscription) this.groupSubscription.unsubscribe();
    this.authenticationSub.unsubscribe();
  }


  private resetForm(): void {
    this.editMode = false;
    this.groupEntryIndex = null;
    this.groupForm.reset();
    this.showForm = true;
    this.router.navigate(['/groups'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (!this.groupForm.valid) return;
    const formValue = this.groupForm.value;
    const entry = new GroupEntry(this.editMode ? this.paramId : '', this.currentUserId, formValue.group);
    this.budgetDataService.onAddGroupEntry(entry);
    this.toast.success(String("Group added"),  'Success', 5000);
    this.resetForm();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onDelete(id: any){
    this.budgetDataService.onDeleteGroupEntries(id);
    this.toast.success(String("Expense removed"),  'Success', 5000);
    this.resetForm();
  }

}
