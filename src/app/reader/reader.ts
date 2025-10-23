import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { GeminiService } from '../shared/gemini-generation.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetDataService } from '../shared/budget-data.component';
import { AuthService } from '../shared/auth-service';
import { UserStoreService } from '../shared/user-store.service';
import { NgToastService } from 'ng-angular-popup'
import { Router } from '@angular/router';
import { AusgabenEntry } from '../shared/ausgaben-entry.model';

@Component({
  selector: 'app-reader',
  standalone: false,
  templateUrl: './reader.html',
  styleUrls: ['./reader.css', '../ImportStyles/customButtons.css']
})
export class Reader {

    groups = [
    { id: 1, name: 'Fixkosten' },
    { id: 2, name: 'Freizeit' },
    { id: 3, name: 'Miete' },
  ];

  currentUserId: string;
  ausgabenEntry: AusgabenEntry;
  budgetForm: FormGroup;
  showForm = false;
  showButton = true;
  URL: string | null = null;
  geminiTotal: string | null = null; // store Gemini response

  constructor(
    private cd: ChangeDetectorRef, 
    private geminiService: GeminiService, 
    private budgetDataService: BudgetDataService, 
    private authService: AuthService, 
    private userStore: UserStoreService,
    private toast: NgToastService,
    private router: Router,
  ) {}


  ngOnInit(){
    this.budgetForm = new FormGroup({
    group: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    value: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^-?\d+(\.\d+)?$/)
    ])
  });
  }


  // Opens the hidden file input
  openFilePicker(): void {
    const el = document.getElementById('imageCapturer') as HTMLInputElement | null;
    el?.click();
  }

  // Triggered when the user selects a file
  useImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log('No file selected');
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      console.warn('Selected file is not an image:', file.type);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      // Save Base64 URL
      this.URL = typeof reader.result === 'string' ? reader.result : null;
      this.cd.markForCheck();

      if (this.URL) {
        this.sendToGemini(this.URL); // send the image to backend immediately
      }
    };

    reader.onerror = (err) => {
      console.error('FileReader error', err);
    };

    reader.readAsDataURL(file);
  }

  // Converts Data URL to Base64 and calls Gemini backend
  private sendToGemini(dataUrl: string): void {
    this.showButton = false;
    const base64Image = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;

    this.geminiService.getBillValue(base64Image).subscribe({
      next: (response) => {
        console.log("Gemini response (total):", response);
        this.geminiTotal = response; // save for template display

        this.budgetForm.patchValue({
          value: this.geminiTotal
        });
        
        this.showForm = true
      },
      error: (err) => {
        this.toast.danger(String(err),  'Error', 5000);
        console.error("Error calling Gemini API:", err);
      }
    });
  }

  onSubmit(): void {
      this.userStore.getUserIdFromStore()
      .subscribe(val=> {
        let currentUserIdFromToken = this.authService.getUserIdFromToken();
        this.currentUserId = val || currentUserIdFromToken
      })

    if (!this.budgetForm.valid) return;

    const formValue = this.budgetForm.value;
    const entry = new AusgabenEntry('', this.currentUserId, formValue.group.name, formValue.title, formValue.value);

    this.budgetDataService.onAddAusgabenEntry(entry);
    this.toast.success(String("Ausgabe added"),  'Success', 5000);
    this.showForm = false;
    this.showButton = true;
    this.URL = null; 
  }
}
