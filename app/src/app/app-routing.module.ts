import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // ROUTES FOR ERRORS
  { path: 'RemoteSync/Error/404', loadChildren: () => import('./components/visitor/notfound/notfound.module').then(m => m.NotfoundModule) },
  // END ROUTES FOR ERRORS









  // ROUTES FOR VISITOR
  { path: 'RemoteSync/Login', loadChildren: () => import('./components/visitor/login/login.module').then(m => m.LoginModule) },
  { path: 'RemoteSync/ForgotPassword', loadChildren: () => import('./components/visitor/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'RemoteSync/ResetPassword', loadChildren: () => import('./components/visitor/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },



  // END ROUTES FOR VISITOR










  // ROUTES FOR ASSOCIATE - Protected by AuthGuard
  { path: 'RemoteSync/Associate/Dashboard', loadChildren: () => import('./components/associate/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'ADMIN'] } },
  { path: 'RemoteSync/Associate/Project', loadChildren: () => import('./components/associate/project/project.module').then(m => m.ProjectModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  {
    path: 'RemoteSync/Associate/Report', // The URL path for the reports page
    loadChildren: () => import('./components/associate/report/report.module').then(m => m.ReportModule), // Lazy load ReportModule
    canActivate: [RoleGuard], // Apply the RoleGuard
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } // Define allowed roles (adjust if needed)
  },
  // END ROUTES FOR ASSOCIATE













  // ROUTES FOR RC
  {
    path: 'RemoteSync/RC/Projects', // Define the URL path
    loadChildren: () => import('./components/rc/projects/projects.module').then(m => m.ProjectsModule),
    canActivate: [RoleGuard], // Apply security
    data: { roles: ['RC', 'ADMIN'] } // Define allowed roles (adjust as needed)
  },

  // END ROUTES FOR RC












  // ROUTES FOR ADMINISTRATOR

  // END ROUTES FOR ADMINISTRATOR











  // WRONG PATH URL
  { path: '', redirectTo: 'RemoteSync/Login', pathMatch: 'full' },
  { path: 'report', loadChildren: () => import('./components/associate/report/report.module').then(m => m.ReportModule) },
  { path: 'projects', loadChildren: () => import('./components/rc/projects/projects.module').then(m => m.ProjectsModule) },
  { path: '**', redirectTo: 'RemoteSync/Error/404' }
  // END WRONG PATH URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
