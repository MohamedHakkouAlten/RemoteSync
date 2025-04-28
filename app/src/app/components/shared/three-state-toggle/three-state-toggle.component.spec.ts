import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeStateToggleComponent } from './three-state-toggle.component';

describe('ThreeStateToggleComponent', () => {
  let component: ThreeStateToggleComponent;
  let fixture: ComponentFixture<ThreeStateToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreeStateToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeStateToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
