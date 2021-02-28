import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BlogCategoryEnum, GetResponseBlogCategorized } from '../../../models/blog-category.enum';
import { BlogPost } from '../../../models/blog-post.model';
import { SpringBlogService } from '../../../services/spring-blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnChanges {


  @Input() postCategory;
  @Input() currentPostId;
  blogPosts : BlogPost[];
  postCategoryAfterEnum : string;
  BlogCategoryEnum = BlogCategoryEnum;

  constructor(private springBlogService: SpringBlogService, private router: Router) { }

  ngOnChanges(): void
  {
    if (this.postCategory)
    {
      this.postCategoryAfterEnum = BlogCategoryEnum[this.postCategory].toLowerCase();
      this.handlePostsInCategory(this.postCategory);
    }
  }


  handlePostsInCategory(postCategory) {
    this.springBlogService.fetchPageAndTumbnailInCategory(0, 4, postCategory).subscribe( (posts : GetResponseBlogCategorized ) => {
      this.blogPosts = posts.content;
      // delete current blogPost from "more in category" if exists
      this.blogPosts = this.blogPosts.filter( blogPost => blogPost.id !== this.currentPostId );
      if (this.blogPosts.length == 4) {
        this.blogPosts.splice(3, 1);
      }
    })
  }


}
