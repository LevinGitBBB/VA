import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth-service";
import { environment } from "./environment";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class GeminiService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  generatedResponse: any;
  localhost = environment.host;

  /**
   * Sends a Base64 image to the backend /bill-value endpoint
   * and gets the total of the bill from Gemini.
   */
  getBillValue(base64Image: string): Observable<string> {
    const token = this.authService.getToken();
    if (!token) return of(''); // return empty if not authenticated

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post<{ response: string }>(
        `http://${this.localhost}:3000/bill-value`,
        {
          prompt: "Please respond with the total of this bill. Only include the number. If there is a comma replace it with a dot.",
          image: base64Image
        },
        { headers }
      )
      .pipe(
        map(res => res.response) // unwrap the response string
      );
  }

}
