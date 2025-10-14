import { Component } from '@angular/core';
import Tesseract from 'tesseract.js';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reader',
  standalone: false,
  templateUrl: './reader.html',
  styleUrls: ['./reader.css', '../ImportStyles/customButtons.css']
})
export class Reader {

  URL: string | null = null;


  constructor(private cd: ChangeDetectorRef) {}

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

    // simplest, avoids event typing issues:
    reader.onload = () => {
      // reader.result may be string | ArrayBuffer | null
      this.URL = typeof reader.result === 'string' ? reader.result : null;
      // Tell Angular to check the component (OnPush)
      this.cd.markForCheck();
    };

    reader.onerror = (err) => {
      console.error('FileReader error', err);
    };

    reader.readAsDataURL(file);

    const { createWorker } = Tesseract;
    (async () => {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      this.getTotal(text);
      console.log(text)
    })();
  
  }

  // helper to open the hidden input from a visible button
  openFilePicker(): void {
    const el = document.getElementById('imageCapturer') as HTMLInputElement | null;
    el?.click();
  }

  getTotal(text: string): void{
    const regex = /^[^\S\r\n]*[=:;\-~>]*\s*total[\s:=-]+([\p{Sc}]?\s*(?:[A-Za-z]{2,4}\s*)?\d[\d\s.,]*\s*(?:[A-Za-z]{1,4}\.?)?)\s*$/gimu;
    let match = regex.exec(text);

    if (match) {
      if (match[1]) {
        console.log("Captured amount:", match[1]);
      } else {
        console.log("Full match:", match[0]);
      }
    } else {
      console.log("No total found");
    }

  }

  gemini(){
    console.log(readReceipt)
  }

}
