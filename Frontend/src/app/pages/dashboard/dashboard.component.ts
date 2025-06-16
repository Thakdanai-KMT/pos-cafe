import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../service/auth.service'; // ✅ เพิ่ม

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  todaySales = 1450;
  topProducts = [
    { name: 'อเมริกาโน่', totalSold: 32 },
    { name: 'ลาเต้', totalSold: 27 },
    { name: 'เค้กช็อกโกแลต', totalSold: 15 }
  ];

  user: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit(): void {}

  logout(): void {
    this.auth.logout(); // ✅ เรียก logout จาก service
    this.router.navigate(['/login']);
  }
}
