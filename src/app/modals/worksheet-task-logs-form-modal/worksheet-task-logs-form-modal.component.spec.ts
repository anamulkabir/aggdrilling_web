import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatInputModule, MatSelectModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { WorksheetTaskLogsFormModalComponent } from './worksheet-task-logs-form-modal.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

describe('WorksheetTaskLogsFormModalComponent', () => {
  let component: WorksheetTaskLogsFormModalComponent;
  let fixture: ComponentFixture<WorksheetTaskLogsFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetTaskLogsFormModalComponent ]
      ,
            imports: [
              ReactiveFormsModule,
              MatChipsModule,
              MatIconModule,
              MatFormFieldModule,
              MatInputModule,
              MatSelectModule,
              NgxMatSelectSearchModule,
              ToastrModule.forRoot(),
              AngularFireModule.initializeApp(environment.firebase),
              AngularFirestoreModule,
              AngularFireAuthModule,
              MatDialogModule,
              BrowserAnimationsModule
            ],
            providers: [
              { provide: MatDialogRef, useValue: {} },
              { provide: MAT_DIALOG_DATA, useValue: [] }
            ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetTaskLogsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
