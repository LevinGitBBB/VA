import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import {  ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { Subscription } from 'rxjs';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/budget-entry.model';
import { UserStoreService } from "../shared/user-store.service";
import { AuthService } from "../shared/auth-service";

export type ChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  colors?: string[];
};



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {

  public fullName : string = "";

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  budgetEntries: BudgetEntry[] = [];
  budgetSubscription: Subscription;

  constructor(private budgetDataService: BudgetDataService, private userStore: UserStoreService, private auth: AuthService) {
    this.chartOptions = {
      series: [],
      chart: { width: 380, type: "pie" },
      labels: [],
      colors: ["#2e3b55", "#3f2f60", "#4b3a7f", "#5c3c9b", "#6a4bbf", "#7b5fe0"],
      responsive: [
        {
          breakpoint: 100,
          options: { chart: { width: 200 }, legend: { position: "bottom" } }
        }
      ]
    };
  }



  ngOnInit(): void {

    this.budgetDataService.getBudgetEntries();

    this.budgetSubscription = this.budgetDataService.budgetSubject.subscribe(
      (entries: BudgetEntry[]) => {
        this.budgetEntries = entries;

        // Group entries by 'group' and sum values
        const grouped = this.budgetEntries.reduce((acc, entry) => {
          const key = String(entry.group);
          if (!acc[key]) acc[key] = 0;
          acc[key] += Number(entry.value); // ensure number
          return acc;
        }, {} as Record<string, number>);

        // Labels
        this.chartOptions.labels = Object.keys(grouped);

        // Series as plain number array
        this.chartOptions.series = Object.values(grouped);
      }
    );

    this.userStore.getFullNameFromStore()
      .subscribe(val=> {
        let FullNameFromToken = this.auth.getFullNameFromToken();
        this.fullName = val || FullNameFromToken
      })
    
  }

  ngOnDestroy(): void {
    if (this.budgetSubscription) this.budgetSubscription.unsubscribe();
  }

}
