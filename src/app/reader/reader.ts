import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { GeminiService } from '../shared/gemini-generation.component';

@Component({
  selector: 'app-reader',
  standalone: false,
  templateUrl: './reader.html',
  styleUrls: ['./reader.css', '../ImportStyles/customButtons.css']
})
export class Reader {

  URL: string | null = null;
  geminiTotal: string | null = null; // store Gemini response

  constructor(private cd: ChangeDetectorRef, private geminiService: GeminiService) {}

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
    const base64Image = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;

    this.geminiService.getBillValue(base64Image).subscribe({
      next: (response) => {
        console.log("Gemini response (total):", response);
        this.geminiTotal = response; // save for template display
      },
      error: (err) => {
        console.error("Error calling Gemini API:", err);
      }
    });
  }

}
