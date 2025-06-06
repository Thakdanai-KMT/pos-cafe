import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // เพิ่ม
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginId = '';  // จะใส่ username หรือ phone ก็ได้
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

login() {
  this.http.post('http://localhost:4000/api/login', {
    loginId: this.loginId, // ใช้ username หรือ phone ได้เลย
    password: this.password
  }).subscribe({
    next: (res: any) => {
      console.log('Login success:', res);
      this.errorMessage = '';
     this.router.navigate(['/dashboard']); // ใช้ Router ที่ถูกต้อง
      // เก็บ token หรือ navigate ได้
    },
    error: (err) => {
      console.error('Login failed:', err);
      this.errorMessage = err.error?.message || 'เข้าสู่ระบบล้มเหลว';
    }
  });
}


}
