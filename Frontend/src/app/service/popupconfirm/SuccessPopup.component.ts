import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-success-popup',
  imports: [CommonModule],
  template: `
    <div class="popup-container">
      <div class="checkmark">✔️</div>
      <p>สั่งซื้อสำเร็จ!</p>
    </div>
  `,
  styles: [`
    .popup-container {
      background-color:rgb(231, 206, 182);
      color: #4caf50;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: scaleFade 0.4s ease;
    }

    .checkmark {
      font-size: 3rem;
      animation: popIn 0.3s ease;
    }

    @keyframes scaleFade {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes popIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1.2);
      }
    }

    p {
      margin-top: 12px;
      font-size: 1.2rem;
      font-weight: 600;
    }
  `]
})
export class SuccessPopupComponent {}
