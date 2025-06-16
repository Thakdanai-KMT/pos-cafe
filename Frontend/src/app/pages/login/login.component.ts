import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginId = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // ถ้า login แล้วให้ redirect ไป dashboard ทันที
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.http.post('http://localhost:4000/api/login', {
      loginId: this.loginId,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.auth.saveLogin(res.token, res.user); // ✅ บันทึก token/user
        this.router.navigate(['/dashboard']);     // ✅ ไปหน้า Dashboard
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'เข้าสู่ระบบล้มเหลว';
      }
    });
  }
}
