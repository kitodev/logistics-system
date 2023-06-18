import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./user-authentication/user-authentication.module').then(
        (m) => m.UserAuthenticationModule
      ),
  },
  
  {
    path: '',
    loadChildren: () => import('./logon.module').then((m) => m.LogonModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
