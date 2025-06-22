import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuthService } from '../../service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService, TopProduct } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule, // ✅ สำคัญมากสำหรับ standalone
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    NgxChartsModule, // ถ้าใช้ ngx-charts
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  todaySales: number = 0;
  todayTop: TopProduct[] = [];

  weekSales: number = 0;
  weekTop: TopProduct[] = [];

  monthSales: number = 0;
  monthTop: TopProduct[] = [];

  user: any;
chartData: any[] = [];
colorScheme = {
  domain: ['#7b4e22', '#c28e49', '#a94442']
};


  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.todaySales = data.todaySales;
        this.todayTop = data.todayTop || [];

        this.weekSales = data.weekSales || 0;
        this.weekTop = data.weekTop || [];

        this.monthSales = data.monthSales || 0;
        this.monthTop = data.monthTop || [];
      },
      error: (err) => {
        console.error('โหลดข้อมูล dashboard ไม่สำเร็จ:', err);
      }
    });
    this.chartData = this.todayTop.map(p => ({
    name: p.name,
    value: p.totalsold
}));

  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

