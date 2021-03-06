import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'environments/environment';
import { UnitdefinitionComponent } from './unitdefinition.component';


describe('UnitdefinitionComponent', () => {
  let component: UnitdefinitionComponent;
  let fixture: ComponentFixture<UnitdefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitdefinitionComponent ],
      imports: [
        MatIconModule,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
        MatSlideToggleModule,
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
    fixture = TestBed.createComponent(UnitdefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
