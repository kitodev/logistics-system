import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ModuleWithProviders } from '@angular/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreatePartnerComponent } from './create-partner/create-partner.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  { path: 'initial-password', component: RegistrationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'register-by-invitation', component: CreatePartnerComponent },
  { path: '**', redirectTo: '/login' },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(
  routes
);
