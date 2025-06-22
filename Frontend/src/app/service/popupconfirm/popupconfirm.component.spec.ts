import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupconfirmComponent } from './popupconfirm.component';

describe('PopupconfirmComponent', () => {
  let component: PopupconfirmComponent;
  let fixture: ComponentFixture<PopupconfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupconfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
