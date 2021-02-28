import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { BlogPost } from '../../models/blog-post.model';



export class BlogPostResolverService implements Resolve<BlogPost> {

  constructor( ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let blogPost = new BlogPost();

    if (localStorage.getItem('blogPost')) {
      blogPost = JSON.parse(localStorage.getItem('blogPost'))
      return blogPost;
    }
    return blogPost;
  }
}
