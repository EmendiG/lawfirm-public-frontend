import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCategoryEnum, GetResponseBlogCategorized } from '../../../models/blog-category.enum';
import { BlogPost, GetResponseBlogPosts } from '../../../models/blog-post.model';
import { SEOService } from '../../../services/seo.service';
import { SpringBlogService } from '../../../services/spring-blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  animations: [
    trigger('grid', [
      transition('* <=> *', [style({ opacity: 0 }), animate(100, style({ opacity: 1 }))]),
    ]),
  ]
})
export class BlogComponent implements OnInit, AfterViewInit {

  blogPosts: BlogPost[];
  mostRecentPosts: BlogPost[] = [];

  postsCategory;
  thePageNumber: number = 1;
  thePageSize: number = 9;
  theTotalElements: number = 28;
  maxSizePagination : number = 4;

  BlogCategoryEnum : BlogCategoryEnum;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private seoService: SEOService,
              private springBlogService: SpringBlogService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const hostName=" "
    this.seoService.updateCanonicalUrl(hostName+'/blog');

    if ( this.mostRecentPosts === undefined || this.mostRecentPosts.length == 0 ) {
      this.springBlogService.fetchPageAndThumbnail(0, 4).subscribe( (posts : GetResponseBlogPosts ) => {
        this.mostRecentPosts = posts._embedded.blogPosts
        this.mostRecentPosts.forEach( post => {
          post.category = BlogCategoryEnum[post.category]
        })
      })
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        this.maxSizePagination = 1;
      }
    }

    this.route.queryParams.subscribe( () => {

      if (this.route.snapshot.queryParams.category === undefined) {
        this.handleSimplePosts(this.route.snapshot.queryParams.page)
      }

      if (this.route.snapshot.queryParams.category !== undefined) {
        this.postsCategory = this.route.snapshot.queryParams.category
        this.handlePostsInCategory(this.route.snapshot.queryParams.page, this.postsCategory)
      }
    })

  }

  // get N page
  goToPage() {
    if (this.route.snapshot.queryParams.category === undefined) {
      this.router.navigate(["."], { queryParams: { page : this.thePageNumber }, relativeTo: this.route });
    }
    if (this.route.snapshot.queryParams.category !== undefined) {
      this.router.navigate(["."], { queryParams: { category: this.postsCategory, page : this.thePageNumber }, relativeTo: this.route });
    }
  }

  ngAfterViewInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.forceScrollToTop();
    }
  }

  forceScrollToTop() {
    // force scrolling to top because of bug with smooth scrolling
    let i = 1;
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (i < 3) {
        window.scroll(0, i++);
      }
      if (pos < 2) {}
      else {
        window.scroll(0, i++);
        window.clearInterval(scrollToTop);
      }
    }, 70);
  }

  handleSimplePosts(page: number) {
    this.springBlogService.fetchPageAndThumbnail(page - 1, 9).subscribe( (posts : GetResponseBlogPosts ) => {
      this.blogPosts = posts._embedded.blogPosts;
      this.blogPosts.forEach( post => {
        post.category = BlogCategoryEnum[post.category]
      })
      this.thePageNumber = posts.page.number + 1;
      this.thePageSize = posts.page.size;
      this.theTotalElements = posts.page.totalElements;
    })
  }

  handlePostsInCategory(page : number, category : string) {
    this.springBlogService.fetchPageAndTumbnailInCategory(page - 1, 9, category).subscribe( (posts : GetResponseBlogCategorized ) => {
      this.blogPosts = posts.content;
      this.blogPosts.forEach( post => {
        post.category = BlogCategoryEnum[post.category]
      })
      this.thePageNumber = posts.pageable.pageNumber + 1;
      this.thePageSize = posts.pageable.pageSize;
      this.theTotalElements = posts.totalElements;
    })
  }

}



