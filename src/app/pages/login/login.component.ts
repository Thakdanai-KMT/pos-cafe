import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../supabase.client';
@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

   async login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}


