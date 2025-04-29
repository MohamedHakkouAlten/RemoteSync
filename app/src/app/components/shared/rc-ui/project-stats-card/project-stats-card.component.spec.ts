import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatsCardComponent } from './project-stats-card.component';

describe('ProjectStatsCardComponent', () => {
  let component: ProjectStatsCardComponent;
  let fixture: ComponentFixture<ProjectStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
