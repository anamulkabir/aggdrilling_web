import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatCardModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { ProjectPermitsComponent } from './project-permits.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

describe('ProjectPermitsComponent', () => {
  let component: ProjectPermitsComponent;
  let fixture: ComponentFixture<ProjectPermitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPermitsComponent ],
      imports: [
        MatIconModule,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: Router, useValue: [] },
        { provide: ActivatedRoute,  useValue: {
          snapshot: {
            paramMap: convertToParamMap({id: 'asfgsioj1565'})
          }
        } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
