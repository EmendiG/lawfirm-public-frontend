import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';

const appRoutes: Routes = [
  { path: '', pathMatch:'full', component: AuthComponent },
];


@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    NgcCookieConsentModule,
    CommonModule,
    FormsModule,
    SharedModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ]
})
export class AuthModule { }
