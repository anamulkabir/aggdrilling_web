import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatInputModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { WorksheetDetailsFormModalComponent } from './worksheet-details-form-modal.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

describe('WorksheetDetailsFormModalComponent', () => {
  let component: WorksheetDetailsFormModalComponent;
  let fixture: ComponentFixture<WorksheetDetailsFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetDetailsFormModalComponent ],
      imports: [
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatDatepickerModule, 
        MatNativeDateModule,
        MatDialogModule,
        MatSelectModule,
        BrowserAnimationsModule
        
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: Location, useValue: [] },
        { provide: Router, useValue: [] },
        { provide: ActivatedRoute, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
