
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCategoryEnum } from '../../../models/blog-category.enum';
import {
  BlogComment,
  GetResponseBlogComments,
} from '../../../models/blog-comment.model';
import { BlogPost } from '../../../models/blog-post.model';
import { FireAuthService } from '../../../services/fire-auth.service';
import { NavigationService } from '../../../services/navigation.service';
import { SEOService } from '../../../services/seo.service';
import { SpringBlogService } from '../../../services/spring-blog.service';
@Component({
  selector: 'app-blog-article',
  templateUrl: './blog-article.component.html',
  styleUrls: ['./blog-article.component.css'],
})
export class BlogArticleComponent implements AfterViewInit {
  blogArticle: BlogPost = new BlogPost();
  blogComments: BlogComment[] = [];

  thePageNumber: number = 1;
  thePageSize: number = 20;
  theTotalElements: number = 18;
  BlogCategoryEnum = BlogCategoryEnum;

  blogArticlePostTime : string;
  currentUrl : string;


  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private springBlogService: SpringBlogService,
    private route: ActivatedRoute,
    public router : Router,
    private metaService: Meta,
    private seoService: SEOService,
    private navigation: NavigationService,
    private fireAuthService: FireAuthService
  ) {
    if(isPlatformBrowser(this.platformId)) {
      this.isAuthenticated()
    }

    this.route.params.subscribe(() => {
      this.getPost();
      this.fetchComments();
      if(isPlatformBrowser(this.platformId)) {
        this.forceScrollToTop();
      }
    });

  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.forceScrollToTop();
    }
  }

  getPost() {
    const id: number = +this.route.snapshot.params['id'];
    const hostName=" "
    this.seoService.updateCanonicalUrl(hostName+'/blog' + '/'+id);

    this.springBlogService.fetchPost(id).subscribe((post) => {
      this.currentUrl = hostName + this.router.url;
      this.blogArticle = post;
      this.blogArticle.id = id;
      this.blogArticlePostTime = BlogArticleComponent.reformatDate(post.postTime);

      this.metaService.updateTag( { property: 'og:image', content: post.pictureUrl });
      this.metaService.updateTag( { property: 'og:title', content: post.title });
      // this.metaService.updateTag( { property: 'og:type', content: 'article' });
      this.metaService.updateTag( { property: 'og:description', content: post.description});
      this.metaService.updateTag( { property: 'og:url', content: this.currentUrl });
      // this.metaService.updateTag( { property: 'og:image:height', content: '160' });
      // this.metaService.updateTag( { property: 'og:image:width', content: '350' });
      this.metaService.updateTag({name: 'twitter:title', content: post.title });
      this.metaService.updateTag({name: 'twitter:description', content: post.description });
      this.metaService.updateTag({name: 'twitter:image', content: post.pictureUrl });
      this.metaService.updateTag({name: 'twitter:image:alt', content: post.title });
      this.metaService.updateTag({name: 'title', content: post.title });

    });

  }

  static reformatDate(dateStr) {
    let dateArr = dateStr.split("-");
    return dateArr[2]+ "." + dateArr[1] + "." +dateArr[0];
  }

  navigateBack() {
    this.navigation.back()
  }

  fetchComments() {
    const id: number = +this.route.snapshot.params['id'];
    this.springBlogService
      .fetchComments(id)
      .subscribe((comments: GetResponseBlogComments) => {
        this.blogComments = comments._embedded.blogComments;
        this.blogComments.forEach( (blogComment : BlogComment) => {
          blogComment.commentTime = BlogArticleComponent.reformatDate(blogComment.commentTime);
        })
        this.sortComments(this.blogComments);
        this.thePageNumber = comments.page.number + 1;
        this.thePageSize = comments.page.size;
        this.theTotalElements = comments.page.totalElements;
      });

  }

  sortComments(commentsArray: BlogComment[]) {
    let currentId = 0;

    commentsArray
      .sort((a, b) => {
        if (a.mainParentId > b.mainParentId) {
          return -1;
        }
        if (a.mainParentId < b.mainParentId) {
          return 1;
        }
      })
      .sort((a, b) => {
        if (a.id == a.mainParentId) {
          currentId = a.id;
          return 0;
        }
        if (a.mainParentId == currentId && b.mainParentId == currentId) {
          if (a.parentId == b.parentId) {
            return 0;
          }
          if (a.id < b.parentId) {
            return -1;
          }
          if (a.id > b.parentId && b.parentId != b.mainParentId) {
            return 1;
          }
        }
        return 0;
      });
  }

  commentAnswerShow = false;
  // purpose is to check if "Odpowiedz" for parentId was clicked or for another parentId?
  commentAnswerId = -1;
  // purpose is to find last blogComment for parentId to inject app-blog-comment after it
  returnId = 0;

  openAnswerComponent(id) {
    let _returnId = 0;

    for(let blogComment of this.blogComments) {
      if (blogComment.parentId === id) {
        _returnId = blogComment.id
      }
    }
    this.returnId = _returnId;

    if (id !== this.commentAnswerId) {
      this.commentAnswerId = id;
      this.commentAnswerShow = true;
    } else {
      this.commentAnswerShow = !this.commentAnswerShow;
    }
  }

  adminUser = false;
  static adminUserr = false;

  isAuthenticated(){
    this.fireAuthService.getUser().subscribe( (user => {
      if (user !== null) {
        this.adminUser = true;
        BlogArticleComponent.adminUserr = true;
      }
    }))
  }

  onEdit() {
    if (this.adminUser) {
      this.blogArticle.id = +this.route.snapshot.params['id'];
      localStorage.setItem('blogPost', JSON.stringify(this.blogArticle))
      this.router.navigate(["admin"])
    }
  }

  commentSubmitted(event) {
    if (event === true) {
      this.fetchComments();
      this.commentAnswerShow = !this.commentAnswerShow;
    }
  }

  onCommentDelete(id : number) {
    if (this.adminUser) {
      this.springBlogService.deleteComment(id).subscribe( () => {})
    }
  }

  forceScrollToTop() {
    // force scrolling to top because of bug with smooth scrolling <- action trigger (i++) required!
    let i = 1;
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (i < 3) {
        window.scroll(0, i++);
      } else if (i > 10) {
        i = 0;
      }

      if (pos < 2) {
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 30);
  }


}
