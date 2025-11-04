import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import {  ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { Subscription } from 'rxjs';
import { BudgetDataService } from '../shared/budget-data.component';
import { BudgetEntry } from '../shared/models/budget-entry.model';
import { UserStoreService } from "../shared/user-store.service";
import { AuthService } from "../shared/auth-service";
import { ExpenseEntry } from "../shared/models/expense-entry.model";
import { GroupEntry } from "../shared/models/group-entry.model";

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
export class Home implements OnInit, OnDestroy   {

  public fullName : string = "";

  @ViewChild("chart") chart: ChartComponent;
  @ViewChildren('groupGauge') groupGauges!: QueryList<ElementRef<SVGSVGElement>>;
  private gaugesAnimated = false; // prevent multiple animations
  public chartOptions: Partial<ChartOptions>;
  public totalOverview: Partial<ChartOptions>;
  budgetEntries: BudgetEntry[] = [];
  expenseEntries: ExpenseEntry[] = [];
  groupEntries: GroupEntry[] = [];
  budgetSubscription: Subscription;
  incomeSubscription: Subscription;
  expenseSubscription: Subscription;
  groupSubcription: Subscription;
  income: number; 
  groupedBudgetEntries: { group: string; total: number }[] = []; // also empty array
  groupedExpenseEntries: { group: string; total: number }[] = []; // also empty array
  groupedMaxSpending: { groupName: string; maxSpending: number }[] = []; // also empty array
  totalBudgetValue: number; 
  totalExpenseValue: number;
  incomeRest: number; 


  readonly radius = 20;
  readonly strokeWidth = 4;
  readonly circumference = 2 * Math.PI * this.radius;
  backgroundColors = ['#F1EEFD'];
  strokeColors = ["#2e3b55", "#3f2f60", "#4b3a7f", "#5c3c9b", "#6a4bbf", "#7b5fe0"];


  constructor(private budgetDataService: BudgetDataService, private userStore: UserStoreService, private auth: AuthService) {
    this.chartOptions = {
      series: [],
      chart: { width: 380, type: "pie" },
      labels: [],
      colors: this.strokeColors,
      responsive: [
        {
          breakpoint: 100,
          options: { chart: { width: 200 }, legend: { position: "bottom" } }
        }
      ]
    };

    this.totalOverview = {
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
    this.budgetDataService.getExpenseEntries();
    this.budgetDataService.getGroupEntries();
    this.budgetDataService.getIncome();

    ////////////////////////////BUDGET////////////////////////////

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

        this.groupedBudgetEntries = Object.entries(grouped).map(([group, total]) => ({
          group,
          total
        }));

        this.totalBudgetValue = this.groupedBudgetEntries.reduce((sum, entry) => sum + entry.total, 0);

        this.updateTotalOverview();
      }
    );

    ////////////////////////////EXPENSES////////////////////////////

      this.expenseSubscription = this.budgetDataService.expenseSubject.subscribe(
      (entries: ExpenseEntry[]) => {
        this.expenseEntries = entries;

        const grouped = this.expenseEntries.reduce((acc, entry) => {
          const key = String(entry.group);
          if (!acc[key]) acc[key] = 0;
          acc[key] += Number(entry.value); // ensure number
          return acc;
        }, {} as Record<string, number>);

        this.groupedExpenseEntries = Object.entries(grouped).map(([group, total]) => ({
          group,
          total
        }));
        
        this.totalExpenseValue = this.groupedExpenseEntries.reduce((sum, entry) => sum + entry.total, 0);
        this.updateTotalOverview();
      }
    );


    this.incomeSubscription = this.budgetDataService.incomeSubject.subscribe(
      (incomeValue: number) => {
        this.income = incomeValue;
        this.updateTotalOverview();
      }
    );

    this.userStore.getFullNameFromStore()
      .subscribe(val=> {
        let FullNameFromToken = this.auth.getFullNameFromToken();
        this.fullName = val || FullNameFromToken
        this.fullName= this.fullName.charAt(0).toUpperCase() + this.fullName.slice(1); // capitalize first letter
      })


   ////////////////////////////Groups////////////////////////////

      this.groupSubcription = this.budgetDataService.groupSubject.subscribe(
      (entries: GroupEntry[]) => {
        this.groupEntries = entries;

        const grouped = this.groupEntries.reduce((acc, entry) => {
          const key = String(entry.groupName);
          if (!acc[key]) acc[key] = 0;
          acc[key] += Number(entry.maxSpending); // ensure number
          return acc;
        }, {} as Record<string, number>);

        this.groupedMaxSpending = Object.entries(grouped).map(([groupName, maxSpending]) => ({
          groupName,
          maxSpending
        }));
        

        setTimeout(() => this.animateGroupGauges(), 50);
      }
    );


  }

private animateGroupGauges(): void {
  if (!this.groupGauges?.length) return;

  this.groupGauges.forEach((gaugeRef, i) => {
    const gauge = gaugeRef.nativeElement;
    const percent = this.getGroupPercentUsed(this.groupedMaxSpending[i].groupName);
    const circle = gauge.querySelector<SVGCircleElement>('circle:nth-child(2)');
    if (!circle) return;

    const circumference = 2 * Math.PI * this.radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1.5s ease';
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = `${offset}`;
      circle.style.strokeOpacity = '1';
    }, 50);
  });
}



  ngOnDestroy(): void {
    this.budgetSubscription?.unsubscribe();
    this.expenseSubscription?.unsubscribe();
    this.incomeSubscription?.unsubscribe();
  }

  private updateTotalOverview(): void {
  if (
    this.totalBudgetValue != null &&
    this.totalExpenseValue != null &&
    this.income != null
  ) {
    this.incomeRest = this.income - (this.totalBudgetValue + this.totalExpenseValue);

    this.totalOverview = {
      ...this.totalOverview,
      labels: ["Income Left", "Budget Total", "Expenses Total"],
      series: [this.incomeRest, this.totalBudgetValue, this.totalExpenseValue],
    };
  }
}


getGroupPercentUsed(groupName: string): number {
  const groupBudget = this.groupedBudgetEntries.find(g => g.group === groupName)?.total ?? 0;
  const groupMax = this.groupedMaxSpending.find(g => g.groupName === groupName)?.maxSpending ?? 1; // avoid division by 0
  return Math.min((groupBudget / groupMax) * 100, 100);
}

}
