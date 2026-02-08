import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('PatientDashboardComponent', () => {
  let component: PatientDashboardComponent;
  let fixture: ComponentFixture<PatientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PatientDashboardComponent, 
        NoopAnimationsModule
      ],
      providers: [
        provideRouter([]) // Provides routing context for any links in the dashboard
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});