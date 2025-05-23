import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteStatsCardComponent } from './site-stats-card.component';

describe('SiteStatsCardComponent', () => {
  let component: SiteStatsCardComponent;
  let fixture: ComponentFixture<SiteStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteStatsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
