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



  { path: 'RemoteSync/Example', loadChildren: () => import('./example/example.module').then(m => m.ExampleModule) },
  // END ROUTES FOR VISITOR










  // ROUTES FOR ASSOCIATE - Protected by AuthGuard
  { path: 'RemoteSync/Associate/Dashboard', loadChildren: () => import('./components/associate/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'ADMIN'] } },
  { path: 'RemoteSync/Associate/Project', loadChildren: () => import('./components/associate/project/project.module').then(m => m.ProjectModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  // END ROUTES FOR ASSOCIATE













  // ROUTES FOR RC

  // END ROUTES FOR RC












  // ROUTES FOR ADMINISTRATOR

  // END ROUTES FOR ADMINISTRATOR











  // WRONG PATH URL
  { path: '', redirectTo: 'RemoteSync/Login', pathMatch: 'full' },
  { path: '**', redirectTo: 'RemoteSync/Error/404' }
  // END WRONG PATH URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
