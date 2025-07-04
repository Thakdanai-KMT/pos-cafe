import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface MenuItem {
  id?: string;
  name: string;
  sale_price: number;
  image?: string | null;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: Category[] = [];
  newItem: MenuItem = { name: '', sale_price: 0, image: '', category_id: '' };
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  editingItem: MenuItem | null = null;
  selectedEditFile: File | null = null;
  previewEditImage: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchMenu();
  }

  fetchCategories() {
    this.http.get<Category[]>('http://localhost:4000/api/categories').subscribe(data => {
      this.categories = data;
    });
  }

  fetchMenu() {
    this.http.get<MenuItem[]>('http://localhost:4000/api/products').subscribe(data => {
      this.menuItems = data;
    });
  }

  getCategoryName(category_id?: string): string {
    if (!category_id) return 'ไม่ระบุประเภท';
    const cat = this.categories.find(c => c.id === category_id);
    return cat ? cat.name : 'ไม่ระบุประเภท';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onEditFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedEditFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewEditImage = reader.result;
      };
      reader.readAsDataURL(this.selectedEditFile);
    }
  }

  addItem() {
    if (!this.newItem.category_id) {
      alert('กรุณาเลือกประเภทสินค้า');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newItem.name);
    formData.append('sale_price', this.newItem.sale_price.toString());
    formData.append('category_id', this.newItem.category_id);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post('http://localhost:4000/api/products', formData).subscribe(() => {
      this.fetchMenu();
      this.newItem = { name: '', sale_price: 0, image: '', category_id: '' };
      this.selectedFile = null;
      this.previewImage = null;
    });
  }

  editItem(item: MenuItem) {
    this.editingItem = { ...item };
    this.selectedEditFile = null;
    this.previewEditImage = null;
  }

updateItem() {
  if (!this.editingItem || !this.editingItem.id) return;
  if (!this.editingItem.category_id) {
    alert('กรุณาเลือกประเภทสินค้า');
    return;
  }

  const formData = new FormData();
  formData.append('name', this.editingItem.name);
  formData.append('sale_price', this.editingItem.sale_price.toString());
  formData.append('category_id', this.editingItem.category_id);

  // ✅ เพิ่มไฟล์ใหม่ถ้ามีเท่านั้น
  if (this.selectedEditFile) {
    formData.append('image', this.selectedEditFile);
  }

  this.http.put(`http://localhost:4000/api/products/${this.editingItem.id}`, formData).subscribe(() => {
    this.editingItem = null;
    this.selectedEditFile = null;
    this.previewEditImage = null;
    this.fetchMenu();
  });
}

  deleteItem(item: MenuItem) {
    if (confirm(`ลบเมนู ${item.name} ?`)) {
      this.http.delete(`http://localhost:4000/api/products/${item.id}`).subscribe(() => {
        this.fetchMenu();
      });
    }
  }

  cancelEdit() {
    this.editingItem = null;
    this.selectedEditFile = null;
    this.previewEditImage = null;
  }
}
