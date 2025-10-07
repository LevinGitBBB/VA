import { Component } from '@angular/core';
import Tesseract from 'tesseract.js';


@Component({
  selector: 'app-reader',
  standalone: false,
  templateUrl: './reader.html',
  styleUrl: './reader.css'
})
export class Reader {

  private image: string; 
  private key: string; 
  
  tesseract(): void {
    const { createWorker } = Tesseract;
    (async () => {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize("https://c7.alamy.com/compde/2h6kt3n/belege-gedruckte-rechnungen-schecks-beleg-drucken-rechnung-betrag-kaufen-wahl-papier-scheck-kosten-bargeld-einzelhandelspreis-kaufbeleg-2h6kt3n.jpg");
      console.log(text);
    })();
  }


}
