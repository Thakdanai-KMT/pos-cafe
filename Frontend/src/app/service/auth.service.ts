import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

//   getUser(): any {
//     const user = localStorage.getItem(this.userKey);
//     return user ? JSON.parse(user) : null;
//   }
  getUser(): any {
  const user = localStorage.getItem(this.userKey);

  // ✅ ตรวจว่า user มีค่าและไม่ใช่ string "undefined"
  if (user && user !== 'undefined') {
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Error parsing user JSON:', e);
      return null;
    }
  }

  return null;
}
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveLogin(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
