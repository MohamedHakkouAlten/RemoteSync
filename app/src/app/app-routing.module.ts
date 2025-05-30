import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { SupportedLanguage } from './services/language/language.service';

// Define supported languages for route prefixes
const supportedLanguages: SupportedLanguage[] = ['en', 'fr', 'es'];

// Create routes with language prefixes
const routes: Routes = [
  // ROUTES FOR ERRORS
  { path: 'remotesync/error/404', loadChildren: () => import('./components/visitor/notfound/notfound.module').then(m => m.NotfoundModule) },
  
  // Language-prefixed routes for errors
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/Error/404`,
    loadChildren: () => import('./components/visitor/notfound/notfound.module').then(m => m.NotfoundModule)
  })),
  // END ROUTES FOR ERRORS

  // ROUTES FOR VISITOR
  { path: 'remotesync/login', loadChildren: () => import('./components/visitor/login/login.module').then(m => m.LoginModule) },
  { path: 'remotesync/forgot-password', loadChildren: () => import('./components/visitor/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'remotesync/reset-password', loadChildren: () => import('./components/visitor/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
  
  // Language-prefixed routes for visitor
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/login`,
    loadChildren: () => import('./components/visitor/login/login.module').then(m => m.LoginModule)
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/forgot-password`,
    loadChildren: () => import('./components/visitor/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/reset-password`,
    loadChildren: () => import('./components/visitor/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  })),
  // END ROUTES FOR VISITOR










  // ROUTES FOR ASSOCIATE
  { path: 'remotesync/associate/dashboard', loadChildren: () => import('./components/associate/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  { path: 'remotesync/associate/project', loadChildren: () => import('./components/associate/project/project.module').then(m => m.ProjectModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  { path: 'remotesync/associate/calendar', loadChildren: () => import('./components/associate/calendar/calendar.module').then(m => m.CalendarModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  { path: 'remotesync/associate/report', loadChildren: () => import('./components/associate/report/report.module').then(m => m.ReportModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  { path: 'remotesync/associate/notification', loadChildren: () => import('./components/associate/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  { path: 'remotesync/associate/profile', loadChildren: () => import('./components/shared/profile/profile.module').then(m => m.ProfileModule), canActivate: [RoleGuard], data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] } },
  
  // Language-prefixed routes for associate
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/dashboard`,
    loadChildren: () => import('./components/associate/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/project`,
    loadChildren: () => import('./components/associate/project/project.module').then(m => m.ProjectModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/calendar`,
    loadChildren: () => import('./components/associate/calendar/calendar.module').then(m => m.CalendarModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/report`,
    loadChildren: () => import('./components/associate/report/report.module').then(m => m.ReportModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/notification`,
    loadChildren: () => import('./components/associate/notifications/notifications.module').then(m => m.NotificationsModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/associate/profile`,
    loadChildren: () => import('./components/shared/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [RoleGuard],
    data: { roles: ['ASSOCIATE', 'RC', 'ADMIN'] }
  })),
  // END ROUTES FOR ASSOCIATE













  // ROUTES FOR RC
  { path: 'remotesync/rc/dashboard', loadChildren: () => import('./components/rc/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [RoleGuard], data: { roles: ['RC', 'ADMIN'] } },
  { path: 'remotesync/rc/project', loadChildren: () => import('./components/rc/project/project.module').then(m => m.ProjectModule), canActivate: [RoleGuard], data: { roles: ['RC', 'ADMIN'] } },
  { path: 'remotesync/rc/report', loadChildren: () => import('./components/rc/report/report.module').then(m => m.ReportModule), canActivate: [RoleGuard], data: { roles: ['RC', 'ADMIN'] } },
  { path: 'remotesync/rc/profile', loadChildren: () => import('./components/shared/profile/profile.module').then(m => m.ProfileModule), canActivate: [RoleGuard], data: { roles: ['RC', 'ADMIN'] } },
  { path: 'remotesync/rc/calendar', loadChildren: () => import('./components/rc/calendar/calendar.module').then(m => m.CalendarModule), canActivate: [RoleGuard], data: { roles: ['RC', 'ADMIN'] } },
  
  // Language-prefixed routes for RC
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/rc/dashboard`,
    loadChildren: () => import('./components/rc/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [RoleGuard],
    data: { roles: ['RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/rc/project`,
    loadChildren: () => import('./components/rc/project/project.module').then(m => m.ProjectModule),
    canActivate: [RoleGuard],
    data: { roles: ['RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/rc/report`,
    loadChildren: () => import('./components/rc/report/report.module').then(m => m.ReportModule),
    canActivate: [RoleGuard],
    data: { roles: ['RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/rc/profile`,
    loadChildren: () => import('./components/shared/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [RoleGuard],
    data: { roles: ['RC', 'ADMIN'] }
  })),
  ...supportedLanguages.map(lang => ({
    path: `${lang}/remotesync/rc/calendar`,
    loadChildren: () => import('./components/rc/calendar/calendar.module').then(m => m.CalendarModule),
    canActivate: [RoleGuard],
    data: { roles: ['RC', 'ADMIN'] }
  })),
  // END ROUTES FOR RC












  // ROUTES FOR ADMINISTRATOR

  // END ROUTES FOR ADMINISTRATOR











  // WRONG PATH URL
  { path: '', redirectTo: 'en/remotesync/Login', pathMatch: 'full' },
  { path: '**', redirectTo: 'en/remotesync/Error/404' }
  // END WRONG PATH URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
