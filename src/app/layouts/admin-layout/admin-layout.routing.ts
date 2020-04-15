import { Routes } from '@angular/router';

import { UserComponent } from 'app/user/user.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AuthGuard } from 'app/authenticationService/auth-guard.service';
import { AuthGuard2 } from 'app/authenticationService/auth-guard2.service';
import { CoreSizesComponent } from 'app/core-sizes/core-sizes.component';
import { EquipmentsComponent } from 'app/equipments/equipments.component';
import { GeologistsComponent } from 'app/geologists/geologists.component';
import { MaterialsComponent } from 'app/materials/materials.component';
import { WorkersComponent } from 'app/workers/workers.component';
import { ProjectsComponent } from 'app/projects/projects.component';
import { ProjectStepsComponent } from 'app/project-steps/project-steps.component';
import { RigsComponent } from 'app/rigs/rigs.component';
import { UnitdefinitionComponent } from 'app/unitdefinition/unitdefinition.component';
import { ProjectDetailsComponent } from 'app/projectDetails/projects-details.component';
import { TasksComponent } from 'app/tasks/tasks.component';
import { TaskTypesComponent } from 'app/taskTypes/task-types.component';
import { LogTypesComponent } from 'app/logTypes/log-types.component';
import { WorksheetsComponent } from 'app/worksheets/worksheets.component';
import { ProjectPermitsComponent } from 'app/project-permits/project-permits.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'user',        component: UserComponent, canActivate: [AuthGuard2] },
    { path: 'user/:id',        component: ProjectPermitsComponent, canActivate: [AuthGuard2] },
    { path: 'core-sizes',        component: CoreSizesComponent, canActivate: [AuthGuard2] },
    { path: 'equipments',   component: EquipmentsComponent, canActivate: [AuthGuard2] },
    { path: 'geologists',     component: GeologistsComponent, canActivate: [AuthGuard2] },
    { path: 'materials',     component: MaterialsComponent, canActivate: [AuthGuard2] },
    { path: 'workers',          component: WorkersComponent, canActivate: [AuthGuard2] },
    { path: 'projects',           component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:id',           component: ProjectDetailsComponent, canActivate: [AuthGuard2] },
    { path: 'projects-worksheets/:id',           component: WorksheetsComponent, canActivate: [AuthGuard] },
    { path: 'project-steps',           component: ProjectStepsComponent, canActivate: [AuthGuard2] },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'rigs',        component: RigsComponent, canActivate: [AuthGuard2] },
    { path: 'tasks',        component: TasksComponent, canActivate: [AuthGuard2] },
    { path: 'task-types',        component: TaskTypesComponent, canActivate: [AuthGuard2] },
    { path: 'log-types',        component: LogTypesComponent, canActivate: [AuthGuard2] },
    { path: 'unitdefinition',        component: UnitdefinitionComponent, canActivate: [AuthGuard2] }
];
