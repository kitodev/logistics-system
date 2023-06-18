import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { routing } from './user-authentication-routing';
import { TranslocoRootModule } from '../transloco-root.module';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreatePartnerComponent } from './create-partner/create-partner.component';
import { FormComponentModule } from '../shared/form/form-component.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    ResetPasswordComponent,
    CreatePartnerComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    routing,
    TranslocoRootModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    FormComponentModule,
    NgxFileDropModule,
    OwlNativeDateTimeModule,
    FontAwesomeModule,
    NgSelectModule,
    NgOptionHighlightModule,
  ],
})
export class UserAuthenticationModule {}
