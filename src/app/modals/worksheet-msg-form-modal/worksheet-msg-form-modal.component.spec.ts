import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatInputModule, MatSelectModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { WorksheetMsgFormModalComponent } from './worksheet-msg-form-modal.component';
import { AngularFireAuthModule } from '@angular/fire/auth';

describe('WorksheetMsgFormModalComponent', () => {
  let component: WorksheetMsgFormModalComponent;
  let fixture: ComponentFixture<WorksheetMsgFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetMsgFormModalComponent ],
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
        MatDialogModule,
        BrowserAnimationsModule,
        MatSelectModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetMsgFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
