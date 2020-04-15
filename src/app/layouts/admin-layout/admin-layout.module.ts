import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UserComponent } from 'app/user/user.component';
import { ProjectsComponent } from 'app/projects/projects.component';
import { WorkersComponent } from 'app/workers/workers.component';
import { MaterialsComponent } from 'app/materials/materials.component';
import { GeologistsComponent } from 'app/geologists/geologists.component';
import { EquipmentsComponent } from 'app/equipments/equipments.component';
import { CoreSizesComponent } from 'app/core-sizes/core-sizes.component';
import { ProjectStepsComponent } from 'app/project-steps/project-steps.component';
import { UserCreateModalComponent } from 'app/modals/user-create-modal/user-create-modal.component';
import { UserUpdateModalComponent } from 'app/modals/user-update-modal/user-update-modal.component';
import { MatDialogRef, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, 
  MatRippleModule, MatTooltipModule, MatSelectModule, MatCardModule, MatPaginatorModule, MatDatepickerModule, 
  MatNativeDateModule, MatSlideToggleModule, MatGridListModule, MatChipsModule, MatAutocompleteModule, MatTableModule, MatCheckboxModule } from '@angular/material';
import { WorkerFormModalComponent } from 'app/modals/worker-form-modal/worker-form-modal.component';
import { CoresizeFormModalComponent } from 'app/modals/coresize-form-modal/coresize-form-modal.component';
import { GeologistFormModalComponent } from 'app/modals/geologist-form-modal/geologist-form-modal.component';
import { MaterialsFormModalComponent } from 'app/modals/materials-form-modal/materials-form-modal.component';
import { EquipmentFormModalComponent } from 'app/modals/equipment-form-modal/equipment-form-modal.component';
import { ProjectFormModalComponent } from 'app/modals/project-form-modal/project-form-modal.component';
import { RigsComponent } from 'app/rigs/rigs.component';
import { RigsFormModalComponent } from 'app/modals/rigs-form-modal/rigs-form-modal.component';
import { UnitdefinitionComponent } from 'app/unitdefinition/unitdefinition.component';
import { UnitdefinitionFormModalComponent } from 'app/modals/unitdefinition-form-modal/unitdefinition-form-modal.component';
import { Geo_userFormModalComponent } from 'app/modals/geo_user-form-modal/geo_user-form-modal.component';
import { ProjectDetailsComponent } from 'app/projectDetails/projects-details.component';
import { ProjectGeoFormModalComponent } from 'app/modals/project-geo-form-modal/project-geo-form-modal.component';
import { ProjectRigsFormModalComponent } from 'app/modals/project-rigs-form-modal/project-rigs-form-modal.component';
import { ProjectHolesFormModalComponent } from 'app/modals/project-holes-form-modal/project-holes-form-modal.component';
import { ProjectWorkerFormModalComponent } from 'app/modals/project-worker-form-modal/project-worker-form-modal.component';
import { TasksComponent } from 'app/tasks/tasks.component';
import { TaskTypesComponent } from 'app/taskTypes/task-types.component';
import { LogTypesComponent } from 'app/logTypes/log-types.component';
import { ProjectCoreSizeFormModalComponent } from 'app/modals/project-core-size-form-modal/project-core-size-form-modal.component';
import { ProjectMaterialsFormModalComponent } from 'app/modals/project-materials-form-modal/project-materials-form-modal.component';
import { ProjectTaskFormModalComponent } from 'app/modals/project-task-form-modal/project-task-form-modal.component';
import { LogTypeFormModalComponent } from 'app/modals/log-type-form-modal/log-type-form-modal.component';
import { TaskTypeFormModalComponent } from 'app/modals/task-type-form-modal/task-type-form-modal.component';
import { TaskFormModalComponent } from 'app/modals/task-form-modal/task-form-modal.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { WorksheetTaskLogsFormModalComponent } from 'app/modals/worksheet-task-logs-form-modal/worksheet-task-logs-form-modal.component';
import { WorksheetMsgFormModalComponent } from 'app/modals/worksheet-msg-form-modal/worksheet-msg-form-modal.component';
import { WorksheetConsumeMaterialsFormModalComponent } from 'app/modals/worksheet-consume-materials-form-modal/worksheet-consume-materials-form-modal.component';
import { WorksheetsComponent } from 'app/worksheets/worksheets.component';
import { UserProjectPermitFormModalComponent } from 'app/modals/user-project-permit-modal/user-project-permit-modal.component';
import { ProjectPermitsComponent } from 'app/project-permits/project-permits.component';
import { WorksheetDetailsFormModalComponent } from 'app/modals/worksheet-details-form-modal/worksheet-details-form-modal.component';
import { ActivityLogDetailsModalComponent } from 'app/modals/activity-log-details-modal/activity-log-details-modal.component';
import { ProjectStepFormModalComponent } from 'app/modals/project-step-form-modal/project-step-form-modal.component';
import { WorksheetStagesFormModalComponent } from 'app/modals/worksheet-stage-form-modal/worksheet-stage-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    MatButtonModule,
    MatTableModule,
    MatRippleModule,
    MatDatepickerModule, 
    MatChipsModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatCheckboxModule
  ],
  declarations: [
    DashboardComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    ProjectPermitsComponent,
    ProjectStepsComponent,
    WorkersComponent,
    MaterialsComponent,
    GeologistsComponent,
    EquipmentsComponent,
    CoreSizesComponent,
    NotificationsComponent,
    UserComponent,
    RigsComponent,
    UnitdefinitionComponent,
    TasksComponent,
    TaskTypesComponent,
    LogTypesComponent,
    WorksheetsComponent,
    UserCreateModalComponent,
    UserUpdateModalComponent,
    UserProjectPermitFormModalComponent,
    ProjectFormModalComponent,
    WorkerFormModalComponent,
    CoresizeFormModalComponent,
    GeologistFormModalComponent,
    MaterialsFormModalComponent,
    EquipmentFormModalComponent,
    RigsFormModalComponent,
    UnitdefinitionFormModalComponent,
    Geo_userFormModalComponent,
    LogTypeFormModalComponent,
    TaskTypeFormModalComponent,
    TaskFormModalComponent,
    ProjectGeoFormModalComponent,
    ProjectRigsFormModalComponent,
    ProjectHolesFormModalComponent,
    ProjectWorkerFormModalComponent,
    ProjectCoreSizeFormModalComponent,
    ProjectMaterialsFormModalComponent,
    ProjectTaskFormModalComponent,
    WorksheetDetailsFormModalComponent,
    WorksheetTaskLogsFormModalComponent,
    WorksheetMsgFormModalComponent,
    WorksheetConsumeMaterialsFormModalComponent,
    ActivityLogDetailsModalComponent,
    ProjectStepFormModalComponent,
    WorksheetStagesFormModalComponent
  ],
  entryComponents:[
    UserCreateModalComponent,
    UserUpdateModalComponent,
    UserProjectPermitFormModalComponent,
    ProjectFormModalComponent,
    WorkerFormModalComponent,
    CoresizeFormModalComponent,
    GeologistFormModalComponent,
    MaterialsFormModalComponent,
    EquipmentFormModalComponent,
    RigsFormModalComponent,
    UnitdefinitionFormModalComponent,
    Geo_userFormModalComponent,
    LogTypeFormModalComponent,
    TaskTypeFormModalComponent,
    TaskFormModalComponent,
    ProjectGeoFormModalComponent,
    ProjectRigsFormModalComponent,
    ProjectHolesFormModalComponent,
    ProjectWorkerFormModalComponent,
    ProjectCoreSizeFormModalComponent,
    ProjectMaterialsFormModalComponent,
    ProjectTaskFormModalComponent,
    WorksheetDetailsFormModalComponent,
    WorksheetTaskLogsFormModalComponent,
    WorksheetMsgFormModalComponent,
    WorksheetConsumeMaterialsFormModalComponent,
    ActivityLogDetailsModalComponent,
    ProjectStepFormModalComponent,
    WorksheetStagesFormModalComponent
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})

export class AdminLayoutModule {}
