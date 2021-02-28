import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'any'
})
export class SpringEditorService {

  private blogPostUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  postPost(blogPost: BlogPost): Observable<any> {
    return this.httpClient.post<BlogPost>(this.blogPostUrl + `/blogPosts`, blogPost);
  }

  updatePost(blogPost: BlogPost): Observable<any> {
    return this.httpClient.put<BlogPost>(this.blogPostUrl + `/blogPosts/${blogPost.id}`, blogPost);
  }

  deletePost(postId : number): Observable<any> {
    return this.httpClient.delete<number>(this.blogPostUrl + `/blogPosts/${postId}`);
  }

}
