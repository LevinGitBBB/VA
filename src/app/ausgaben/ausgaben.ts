import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BudgetDataService } from '../shared/budget-data.component';
import { AuthService } from '../shared/auth-service';
import { UserStoreService } from '../shared/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { AusgabenEntry } from '../shared/ausgaben-entry.model';

@Component({
  selector: 'app-ausgaben',
  standalone: false,
  templateUrl: './ausgaben.html',
  styleUrls: ['./ausgaben.css', '../ImportStyles/customButtons.css']
})
export class Ausgaben implements OnInit, OnDestroy {

  private authenticationSub: Subscription; 
  isAuthenticated = false;

  showForm = false;
  ausgabenEntries: AusgabenEntry[] = [];
  ausgabenSubscription: Subscription;

  ausgabenForm: FormGroup;
  editMode = false;
  ausgabenEntryIndex: number | null = null;

  private paramId: string; 
  ausgabeEntry: AusgabenEntry; 
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
    this.budgetDataService.getAusgabenEntries();

    // 2️⃣ Subscribe to budget entries updates
    this.ausgabenSubscription = this.budgetDataService.ausgabenSubject.subscribe(
      (entries: AusgabenEntry[]) => {
        this.ausgabenEntries = entries;
      }
    );

    // 3️⃣ Initialize the form
    this.ausgabenForm = new FormGroup({
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
        const ausgabenEntry = this.budgetDataService.getAusgabenEntry(this.paramId);
        if (ausgabenEntry) {
          this.showForm = true; // ensures form shows immediately
          this.ausgabenEntryIndex = this.ausgabenEntries.indexOf(ausgabenEntry);

          const selectedGroup = this.groups.find(g => g.name === ausgabenEntry.group) || null;

          // Patch form values
          this.ausgabenForm.patchValue({
            group: selectedGroup,
            title: ausgabenEntry.title,
            value: ausgabenEntry.value
          });
        }
      } else {
        this.editMode = false;
        this.showForm = false;
        this.ausgabenEntryIndex = null;
        this.ausgabenForm.reset();
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
    if (this.ausgabenSubscription) this.ausgabenSubscription.unsubscribe();
    this.authenticationSub.unsubscribe();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  onDelete(id: string): void {
    this.budgetDataService.onDeleteAusgabenEntries(id);
    this.toast.success(String("Ausgabe removed"),  'Success', 5000);
    if (this.editMode && this.paramId === id) {
      this.resetForm();
    }
  }


  onEdit(id: string): void {
    this.startEdit(id);
  }

  private startEdit(id: string): void {
    const ausgabenEntry = this.ausgabenEntries.find(be => be.id === id);
    if (!ausgabenEntry) return;

    this.ausgabenEntryIndex = this.ausgabenEntries.indexOf(ausgabenEntry);

    const selectedGroup = this.groups.find(g => g.name === ausgabenEntry.group) || null;

    this.ausgabenForm.patchValue({
      group: selectedGroup,
      title: ausgabenEntry.title,
      value: ausgabenEntry.value
    });

    this.paramId = id.toString();
    this.editMode = true;
    this.showForm = true;
  }


  private resetForm(): void {
    this.editMode = false;
    this.ausgabenEntryIndex = null;
    this.ausgabenForm.reset();
    this.showForm = false;
    this.router.navigate(['/edit-budget'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (!this.ausgabenForm.valid) return;

    const formValue = this.ausgabenForm.value;
    const entry = new AusgabenEntry(this.editMode ? this.paramId : '', this.currentUserId, formValue.group.name, formValue.title, formValue.value);

    if (this.editMode) {
      // Update local array
      if (this.ausgabenEntryIndex !== null) {
        this.ausgabenEntries[this.ausgabenEntryIndex] = entry;
        this.budgetDataService.budgetSubject.next(this.ausgabenEntries);
      }
      this.budgetDataService.updateAusgabenEntry(entry.id, entry);
      this.toast.success(String("Ausgabe updated"),  'Success', 5000);
    } else {
      this.budgetDataService.onAddAusgabenEntry(entry);
      this.toast.success(String("Ausgabe added"),  'Success', 5000);
    }

    this.resetForm();
  }

}
