import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetResponseBlogCategorized } from '../models/blog-category.enum';
import { BlogComment, GetResponseBlogComments } from '../models/blog-comment.model';
import { BlogPost, GetResponseBlogPosts } from '../models/blog-post.model';

@Injectable({
  providedIn: 'any'
})
export class SpringBlogService {

  private blogPostUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }


  fetchPageAndThumbnail(page: number, size: number) : Observable<GetResponseBlogPosts> {
    return this.http.get<GetResponseBlogPosts>(this.blogPostUrl + `/blogPosts?projection=blogPostThumbnail&page=${page}&size=${size}&sort=postTime,desc` );
  }

  fetchPageAndTumbnailInCategory(page: number, size: number, category: string) : Observable<GetResponseBlogCategorized> {
    return this.http.get<GetResponseBlogCategorized>(this.blogPostUrl + `/findRecentThumbnailsInCategory?category=${category}&page=${page}&size=${size}&sort=postTime,desc` );
  }

  fetchPost(id : number) :  Observable<BlogPost> {
    return this.http.get<BlogPost>(this.blogPostUrl + `/blogPosts/${id}`)
  }


  fetchComments(postId : number) : Observable<GetResponseBlogComments> {
    return this.http.get<GetResponseBlogComments>(this.blogPostUrl + `/blogComments/search/findByPostId?post=${postId}`);
  }

  fetchCategories() {
    return this.http.get(this.blogPostUrl + `/categories`);
  }

  postComment(blogComment: BlogComment): Observable<any> {
    return this.http.post<BlogComment>(this.blogPostUrl + `/blogComments` , blogComment);
  }

  deleteComment(id : number):  Observable<any> {
    return this.http.delete(this.blogPostUrl + `/blogComments/${id}` );
  }

}

