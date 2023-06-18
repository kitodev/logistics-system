import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TranslocoRootModule } from './transloco-root.module';
import { HttpClientModule } from '@angular/common/http';
import { basePathInterceptorProviders, httpInterceptorProviders } from './auth/http-interceptors';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslocoPersistLangModule, TRANSLOCO_PERSIST_LANG_STORAGE } from '@ngneat/transloco-persist-lang';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClarityModule,
    TranslocoRootModule,
    QuillModule.forRoot(),
    TranslocoPersistLangModule.forRoot({
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage
      }
    }),
    FormsModule,
    HttpClientModule,
    HotToastModule.forRoot(),
  ],
  providers: [basePathInterceptorProviders, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
