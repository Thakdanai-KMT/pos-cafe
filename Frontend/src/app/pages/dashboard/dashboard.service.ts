import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopProduct {
  name: string;
  totalsold: number;
}

export interface DashboardSummary {
  todaySales: number;
  todayTop: TopProduct[];

  weekSales?: number;
  weekTop?: TopProduct[];

  monthSales?: number;
  monthTop?: TopProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>('http://localhost:4000/dashboard/summary-all');
  }
}
