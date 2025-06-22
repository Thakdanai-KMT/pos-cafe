import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PopupconfirmComponent } from '../../service/popupconfirm/popupconfirm.component';
import {  PopupService } from '../../service/popupconfirm/popupconfirm.component.service';
interface MenuItem {
  id: string;
  name: string;
  sku: string;
  category_id?: string;
  sale_price: number;
  cost_price?: number;
  stock_quantity?: number;
  low_stock_alert?: number;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

@Component({
  selector: 'app-menu',
  imports: [
    NgIf,
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  providers: [PopupService],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  orderItems: OrderItem[] = [];

  constructor(private http: HttpClient, private popupService: PopupService) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems() {
    this.http.get<MenuItem[]>('http://localhost:4000/api/products').subscribe({
      next: (data) => {
        this.menuItems = data;
      },
      error: (err) => {
        console.error('❌ ดึงข้อมูลเมนูล้มเหลว:', err);
      },
    });
  }

  clearOrder() {
    this.orderItems = [];
  }

  addToOrder(item: MenuItem) {
    const existing = this.orderItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.orderItems.push({ ...item, quantity: 1 });
    }
  }

  increase(item: OrderItem) {
    item.quantity++;
  }

  decrease(item: OrderItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.remove(item);
    }
  }

  remove(item: OrderItem) {
    this.orderItems = this.orderItems.filter((i) => i.id !== item.id);
  }

  async confirmOrder() {
    const confirmed = await this.popupService.confirm('ยืนยันการสั้งซื้อ?');
    if (confirmed) {
      alert('✅ ยืนยันคำสั่งซื้อเรียบร้อยแล้ว!');
      this.orderItems = [];
    }
  }

  getTotal(): number {
    return this.orderItems.reduce((sum, item) => sum + item.sale_price * item.quantity, 0);
  }
}
