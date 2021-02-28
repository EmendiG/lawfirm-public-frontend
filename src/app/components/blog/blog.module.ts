import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogComponent } from './blog/blog.component';
import { BlogArticleComponent } from './blog-article/blog-article.component';
import { BlogCommentComponent } from './blog-comment/blog-comment.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogNavbarComponent } from './blog-navbar/blog-navbar.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlogAppComponent } from './blog-app.component';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';

const appRoutes: Routes = [
  {
    path: '',
    component: BlogAppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: BlogComponent
      },
      {
        path: ':id',
        component: BlogArticleComponent
      }

    ]
  },
];

@NgModule({
  declarations: [
    BlogComponent,
    BlogArticleComponent,
    BlogCommentComponent,
    BlogListComponent,
    BlogNavbarComponent,
    BlogAppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(appRoutes),
    NgcCookieConsentModule,

    ShareButtonsModule,
    ShareIconsModule,
    NgbModule,
    SharedModule
  ],
  bootstrap: [
    BlogAppComponent
  ]
})
export class BlogModule { }
