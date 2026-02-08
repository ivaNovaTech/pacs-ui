import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyDashboardComponent } from './study-dashboard.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StudyDashboardComponent', () => {
  let component: StudyDashboardComponent;
  let fixture: ComponentFixture<StudyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudyDashboardComponent, // Since it's a standalone component
        NoopAnimationsModule     // Prevents errors with Angular Material animations
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'mrn' ? '12345' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the MRN from the route parameters', () => {
    expect(component.mrn).toBe('12345');
  });

  it('should load initial studies on init', () => {
    expect(component.studies.length).toBeGreaterThan(0);
    expect(component.studies[0].modality).toBe('MR');
  });
});