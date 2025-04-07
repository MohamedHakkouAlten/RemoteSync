import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ROUTES FOR VISITOR
  { path: 'RemoteSync/NotFound', loadChildren: () => import('./components/visitor/notfound/notfound.module').then(m => m.NotfoundModule) },
  { path: 'RemoteSync/Login', loadChildren: () => import('./components/visitor/login/login.module').then(m => m.LoginModule) },
  { path: 'RemoteSync/Example', loadChildren: () => import('./example/example.module').then(m => m.ExampleModule) },
  // END ROUTES FOR VISITOR










  // ROUTES FOR ASSOCIATE
  
  // END ROUTES FOR ASSOCIATE













  // ROUTES FOR RC
  
  // END ROUTES FOR RC












  // ROUTES FOR ADMINISTRATOR
  
  // END ROUTES FOR ADMINISTRATOR











  // WRONG PATH URL
  { path: '', redirectTo: 'RemoteSync/Login', pathMatch: 'full' },
  { path: '**', redirectTo: 'RemoteSync/NotFound' }
  // END WRONG PATH URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
