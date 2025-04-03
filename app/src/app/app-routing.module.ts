import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ROUTES FOR VISITOR
  { path: 'RemoteSync/Home', loadChildren: () => import('./components/visitor/home/home.module').then(m => m.HomeModule) },
  { path: 'RemoteSync/Login', loadChildren: () => import('./components/visitor/login/login.module').then(m => m.LoginModule) },
  // END ROUTES FOR VISITOR










  // ROUTES FOR ASSOCIATE
  
  // END ROUTES FOR ASSOCIATE













  // ROUTES FOR RC
  
  // END ROUTES FOR RC












  // ROUTES FOR ADMINISTRATOR
  
  // END ROUTES FOR ADMINISTRATOR











  // WRONG PATH URL
  { path: '', redirectTo: 'RemoteSync/Home', pathMatch: 'full' },
  { path: '**', redirectTo: 'RemoteSync/Home' }
  // END WRONG PATH URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
