import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
// import { NavbarComponent } from '../../service/navbar/navbar.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
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

  username = 'Admin'; // คุณสามารถเปลี่ยนให้รับจาก Auth จริงได้ภายหลัง

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    // TODO: ลบ token / session ถ้ามี
    this.router.navigate(['/login']);
  }
  
}
