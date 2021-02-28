import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogEditorComponent } from './blog-editor/blog-editor.component';
import { FirebaseProxyComponent } from './firebase-proxy/firebase-proxy.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogPostResolverService } from './blog-post-resolver.service';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { AuthGuard } from '../auth/auth.guard';


const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: BlogEditorComponent,
    resolve: [BlogPostResolverService],
  },
];

@NgModule({
  declarations: [
    BlogEditorComponent,
    FirebaseProxyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(appRoutes),
    NgcCookieConsentModule,

    CKEditorModule,
    SharedModule,
  ],
  providers: [
    BlogPostResolverService,
  ],
})
export class BlogEditorModule { }
